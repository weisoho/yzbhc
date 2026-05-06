import argparse
import posixpath
import shlex
import sys

import paramiko


def create_client(host, username, password, port):
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(hostname=host, port=port, username=username, password=password, timeout=30)
    return client


def stream_command(client, command, sudo_password=None):
    if sudo_password:
        command = f"sudo -S -p '' bash -lc {shlex.quote(command)}"

    stdin, stdout, stderr = client.exec_command(command)
    if sudo_password:
        stdin.write(f"{sudo_password}\n")
        stdin.flush()
    stdin.close()

    output = stdout.read().decode('utf-8', errors='replace')
    error_output = stderr.read().decode('utf-8', errors='replace')
    exit_code = stdout.channel.recv_exit_status()

    if output:
        print(output, end='')
    if error_output:
        print(error_output, end='', file=sys.stderr)

    return exit_code


def ensure_remote_dir(sftp, remote_dir):
    segments = []
    current = posixpath.normpath(remote_dir)

    while current not in ('', '/'):
        segments.append(current)
        current = posixpath.dirname(current)

    for segment in reversed(segments):
        try:
            sftp.stat(segment)
        except IOError:
            sftp.mkdir(segment)


def upload_files(client, remote_dir, local_files):
    with client.open_sftp() as sftp:
        ensure_remote_dir(sftp, remote_dir)
        for local_file in local_files:
            remote_file = posixpath.join(remote_dir, posixpath.basename(local_file))
            sftp.put(local_file, remote_file)
            print(f"uploaded {local_file} -> {remote_file}")


def main():
    parser = argparse.ArgumentParser(description='Run non-interactive SSH/SFTP operations for deployment.')
    parser.add_argument('--host', required=True)
    parser.add_argument('--port', type=int, default=22)
    parser.add_argument('--username', required=True)
    parser.add_argument('--password', required=True)

    subparsers = parser.add_subparsers(dest='command', required=True)

    mkdir_parser = subparsers.add_parser('mkdir')
    mkdir_parser.add_argument('--path', required=True)

    upload_parser = subparsers.add_parser('upload')
    upload_parser.add_argument('--remote-dir', required=True)
    upload_parser.add_argument('--local-file', action='append', dest='local_files', required=True)

    run_parser = subparsers.add_parser('run')
    run_parser.add_argument('--command-text', required=True)
    run_parser.add_argument('--sudo-password', default='')

    args = parser.parse_args()

    client = create_client(args.host, args.username, args.password, args.port)
    try:
        if args.command == 'mkdir':
            exit_code = stream_command(client, f"mkdir -p {shlex.quote(args.path)}")
        elif args.command == 'upload':
            upload_files(client, args.remote_dir, args.local_files)
            exit_code = 0
        else:
            sudo_password = args.sudo_password or None
            exit_code = stream_command(client, args.command_text, sudo_password=sudo_password)
    finally:
        client.close()

    raise SystemExit(exit_code)


if __name__ == '__main__':
    main()
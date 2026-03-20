package com.yunsheng.yzb.controller;

import com.yunsheng.yzb.mapper.YsUserMapper;
import com.yunsheng.yzb.model.YsUser;
import com.yunsheng.yzb.model.YsUserExample;
import com.yunsheng.yzb.utils.AjaxResult;
import com.yunsheng.yzb.utils.LoginCacheUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

/**
 * 用户管理控制器
 */
@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private YsUserMapper ysUserMapper;

    /**
     * 获取用户列表
     */
    @GetMapping("/list")
    public AjaxResult<List<YsUser>> getUserList() {
        YsUserExample example = new YsUserExample();
        List<YsUser> userList = ysUserMapper.selectByExample(example);
        // 移除密码信息
        userList.forEach(user -> user.setPassword(null));
        return AjaxResult.successInstance(userList);
    }

    /**
     * 根据ID获取用户
     */
    @GetMapping("/{id}")
    public AjaxResult<YsUser> getUserById(@PathVariable Integer id) {
        YsUser user = ysUserMapper.selectByPrimaryKey(id);
        if (user != null) {
            user.setPassword(null);
            return AjaxResult.successInstance(user);
        }
        return AjaxResult.res(0, "用户不存在", null);
    }

    /**
     * 创建用户
     */
    @PostMapping
    public AjaxResult<String> createUser(@RequestBody YsUser user) {
        // 检查用户名是否已存在
        YsUserExample example = new YsUserExample();
        example.createCriteria().andUserNameEqualTo(user.getUserName());
        List<YsUser> existingUsers = ysUserMapper.selectByExample(example);
        if (!existingUsers.isEmpty()) {
            return AjaxResult.res(0, "用户名已存在", null);
        }

        // 设置默认值
        user.setCreateTime(new Date());
        user.setUpdateTime(new Date());
        user.setStatus(1); // 默认为启用状态
        if (user.getDepId() == null) {
            user.setDepId(1); // 默认为部门1
        }

        int result = ysUserMapper.insert(user);
        if (result > 0) {
            return AjaxResult.successInstance("创建成功");
        }
        return AjaxResult.errorInstance("创建失败");
    }

    /**
     * 更新用户
     */
    @PutMapping("/{id}")
    public AjaxResult<String> updateUser(@PathVariable Integer id, @RequestBody YsUser user) {
        user.setId(id);
        user.setUpdateTime(new Date());

        int result = ysUserMapper.updateByPrimaryKeySelective(user);
        if (result > 0) {
            return AjaxResult.successInstance("更新成功");
        }
        return AjaxResult.errorInstance("更新失败");
    }

    /**
     * 删除用户
     */
    @DeleteMapping("/{id}")
    public AjaxResult<String> deleteUser(@PathVariable Integer id) {
        int result = ysUserMapper.deleteByPrimaryKey(id);
        if (result > 0) {
            return AjaxResult.successInstance("删除成功");
        }
        return AjaxResult.errorInstance("删除失败");
    }

    /**
     * 切换用户状态
     */
    @PutMapping("/{id}/status")
    public AjaxResult<String> toggleUserStatus(@PathVariable Integer id, @RequestBody Integer status) {
        YsUser user = new YsUser();
        user.setId(id);
        user.setStatus(status);
        user.setUpdateTime(new Date());

        int result = ysUserMapper.updateByPrimaryKeySelective(user);
        if (result > 0) {
            return AjaxResult.successInstance("状态更新成功");
        }
        return AjaxResult.errorInstance("状态更新失败");
    }

    /**
     * 修改密码
     */
    @PutMapping("/{id}/password")
    public AjaxResult<String> updatePassword(@PathVariable Integer id, @RequestBody String newPassword) {
        YsUser user = new YsUser();
        user.setId(id);
        user.setPassword(newPassword);
        user.setUpdateTime(new Date());

        int result = ysUserMapper.updateByPrimaryKeySelective(user);
        if (result > 0) {
            return AjaxResult.successInstance("密码更新成功");
        }
        return AjaxResult.errorInstance("密码更新失败");
    }

    /**
     * 重置密码
     */
    @PutMapping("/{id}/password/reset")
    public AjaxResult<String> resetPassword(@PathVariable Integer id) {
        YsUser user = new YsUser();
        user.setId(id);
        user.setPassword("000000"); // 默认密码
        user.setUpdateTime(new Date());

        int result = ysUserMapper.updateByPrimaryKeySelective(user);
        if (result > 0) {
            return AjaxResult.successInstance("密码重置成功");
        }
        return AjaxResult.errorInstance("密码重置失败");
    }

    /**
     * 检查用户名是否已存在
     */
    @GetMapping("/check-username")
    public AjaxResult<Boolean> checkUsernameExists(@RequestParam String username) {
        YsUserExample example = new YsUserExample();
        example.createCriteria().andUserNameEqualTo(username);
        List<YsUser> existingUsers = ysUserMapper.selectByExample(example);
        return AjaxResult.successInstance(!existingUsers.isEmpty());
    }
}
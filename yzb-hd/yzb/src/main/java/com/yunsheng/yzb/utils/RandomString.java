package com.yunsheng.yzb.utils;

import java.util.HashSet;
import java.util.Random;
import java.util.Set;

public class RandomString {
    private static final String CHAR_STRING = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final int CHAR_STRING_LENGTH = CHAR_STRING.length();

    public static String generateRandomString(int length) {
        Random random = new Random();
        Set<Character> chars = new HashSet<>();
        while (chars.size() < length) {
            chars.add(CHAR_STRING.charAt(random.nextInt(CHAR_STRING_LENGTH)));
        }
        StringBuilder sb = new StringBuilder(length);
        for (Character c : chars) {
            sb.append(c);
        }
        return sb.toString();
    }
}

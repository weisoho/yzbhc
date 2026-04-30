package com.yunsheng.yzb.config.annotation;

import java.lang.annotation.*;

/**
 * 角色校验注解
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RequiresRole {
    
    /**
     * 需要的角色编码
     */
    String[] value() default {};
    
    /**
     * 逻辑关系：AND-需要所有角色，OR-需要任一角色
     */
    Logical logical() default Logical.AND;
    
    enum Logical {
        AND, OR
    }
}

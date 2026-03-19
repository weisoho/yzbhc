package com.yunsheng.yzb;

import com.lk.api.annotation.LKADocument;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan("com.yunsheng")
@MapperScan(basePackages = "com.yunsheng.yzb.mapper")
@ServletComponentScan
public class YzbApplication {

	public static void main(String[] args) {
		SpringApplication.run(YzbApplication.class, args);
	}

}


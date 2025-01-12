package com.openclassrooms.starterjwt;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class SpringBootSecurityJwtApplicationTest {

    @Test
    void contextLoads() {
        // Test que le contexte Spring se charge correctement
        SpringBootSecurityJwtApplication.main(new String[] {});
    }
}
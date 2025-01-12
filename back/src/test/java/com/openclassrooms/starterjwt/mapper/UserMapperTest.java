package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.models.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class UserMapperTest {

    private UserMapper userMapper = Mappers.getMapper(UserMapper.class);
    private User user;
    private UserDto userDto;

    @BeforeEach
    void setUp() {
        LocalDateTime now = LocalDateTime.now();

        user = new User();
        user.setId(1L);
        user.setEmail("test@test.com");
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setPassword("password");
        user.setAdmin(false);
        user.setCreatedAt(now);
        user.setUpdatedAt(now);

        userDto = new UserDto();
        userDto.setId(1L);
        userDto.setEmail("test@test.com");
        userDto.setFirstName("John");
        userDto.setLastName("Doe");
        userDto.setPassword("password");
        userDto.setAdmin(false);
        userDto.setCreatedAt(now);
        userDto.setUpdatedAt(now);
    }

    @Test
    void testToEntity() {
        User result = userMapper.toEntity(userDto);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(userDto.getId());
        assertThat(result.getEmail()).isEqualTo(userDto.getEmail());
        assertThat(result.getFirstName()).isEqualTo(userDto.getFirstName());
        assertThat(result.getLastName()).isEqualTo(userDto.getLastName());
        assertThat(result.getPassword()).isEqualTo(userDto.getPassword());
        assertThat(result.isAdmin()).isEqualTo(userDto.isAdmin());
        assertThat(result.getCreatedAt()).isEqualTo(userDto.getCreatedAt());
        assertThat(result.getUpdatedAt()).isEqualTo(userDto.getUpdatedAt());
    }

    @Test
    void testToDto() {
        UserDto result = userMapper.toDto(user);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(user.getId());
        assertThat(result.getEmail()).isEqualTo(user.getEmail());
        assertThat(result.getFirstName()).isEqualTo(user.getFirstName());
        assertThat(result.getLastName()).isEqualTo(user.getLastName());
        assertThat(result.getPassword()).isEqualTo(user.getPassword());
        assertThat(result.isAdmin()).isEqualTo(user.isAdmin());
        assertThat(result.getCreatedAt()).isEqualTo(user.getCreatedAt());
        assertThat(result.getUpdatedAt()).isEqualTo(user.getUpdatedAt());
    }

    @Test
    void testToEntityWithNullValues() {
        UserDto emptyDto = new UserDto();
        emptyDto.setEmail("default@test.com");
        emptyDto.setFirstName("Default");
        emptyDto.setLastName("User");
        emptyDto.setPassword("defaultPassword");
        User result = userMapper.toEntity(emptyDto);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isNull();
        assertThat(result.getEmail()).isEqualTo("default@test.com");
        assertThat(result.getFirstName()).isEqualTo("Default");
        assertThat(result.getLastName()).isEqualTo("User");
        assertThat(result.getPassword()).isEqualTo("defaultPassword");
        assertThat(result.isAdmin()).isFalse();
        assertThat(result.getCreatedAt()).isNull();
        assertThat(result.getUpdatedAt()).isNull();
    }

    @Test
    void testToDtoWithNullValues() {
        User emptyUser = new User();
        emptyUser.setEmail("default@test.com");
        emptyUser.setFirstName("Default");
        emptyUser.setLastName("User");
        emptyUser.setPassword("defaultPassword");
        UserDto result = userMapper.toDto(emptyUser);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isNull();
        assertThat(result.getEmail()).isEqualTo("default@test.com");
        assertThat(result.getFirstName()).isEqualTo("Default");
        assertThat(result.getLastName()).isEqualTo("User");
        assertThat(result.getPassword()).isEqualTo("defaultPassword");
        assertThat(result.isAdmin()).isFalse();
        assertThat(result.getCreatedAt()).isNull();
        assertThat(result.getUpdatedAt()).isNull();
    }

    @Test
    void testToEntityList() {
        List<UserDto> dtoList = Arrays.asList(userDto);
        List<User> result = userMapper.toEntity(dtoList);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getEmail()).isEqualTo(userDto.getEmail());
    }

    @Test
    void testToDtoList() {
        List<User> userList = Arrays.asList(user);
        List<UserDto> result = userMapper.toDto(userList);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getEmail()).isEqualTo(user.getEmail());
    }
}
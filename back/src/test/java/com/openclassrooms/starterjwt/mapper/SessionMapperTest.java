package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.TeacherService;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
public class SessionMapperTest {

    @Mock
    private TeacherService teacherService;

    @Mock
    private UserService userService;

    @InjectMocks
    private SessionMapper sessionMapper = Mappers.getMapper(SessionMapper.class);

    private Session session;
    private SessionDto sessionDto;
    private Teacher teacher;
    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Initialiser les objets de test
        teacher = new Teacher();
        teacher.setId(1L);
        teacher.setFirstName("John");
        teacher.setLastName("Doe");

        user = new User();
        user.setId(1L);
        user.setEmail("user@test.com");
        user.setFirstName("User");
        user.setLastName("Test");

        session = new Session();
        session.setId(1L);
        session.setName("Yoga Session");
        session.setDate(new Date());
        session.setDescription("Test Description");
        session.setTeacher(teacher);
        session.setUsers(Arrays.asList(user));

        sessionDto = new SessionDto();
        sessionDto.setId(1L);
        sessionDto.setName("Yoga Session");
        sessionDto.setDate(new Date());
        sessionDto.setDescription("Test Description");
        sessionDto.setTeacher_id(1L);
        sessionDto.setUsers(Arrays.asList(1L));

        // Configuration des mocks
        when(teacherService.findById(1L)).thenReturn(teacher);
        when(userService.findById(1L)).thenReturn(user);
    }

    @Test
    void testToEntity() {
        Session result = sessionMapper.toEntity(sessionDto);

        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo(sessionDto.getName());
        assertThat(result.getDescription()).isEqualTo(sessionDto.getDescription());
        assertThat(result.getTeacher()).isNotNull();
        assertThat(result.getTeacher().getId()).isEqualTo(sessionDto.getTeacher_id());
        assertThat(result.getUsers()).hasSize(1);
        assertThat(result.getUsers().get(0).getId()).isEqualTo(sessionDto.getUsers().get(0));
    }

    @Test
    void testToDto() {
        SessionDto result = sessionMapper.toDto(session);

        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo(session.getName());
        assertThat(result.getDescription()).isEqualTo(session.getDescription());
        assertThat(result.getTeacher_id()).isEqualTo(session.getTeacher().getId());
        assertThat(result.getUsers()).hasSize(1);
        assertThat(result.getUsers().get(0)).isEqualTo(session.getUsers().get(0).getId());
    }

    @Test
    void testToEntityWithNullValues() {
        SessionDto emptyDto = new SessionDto();
        Session result = sessionMapper.toEntity(emptyDto);

        assertThat(result).isNotNull();
        assertThat(result.getTeacher()).isNull();
        assertThat(result.getUsers()).isEmpty();
    }

    @Test
    void testToDtoWithNullValues() {
        Session emptySession = new Session();
        SessionDto result = sessionMapper.toDto(emptySession);

        assertThat(result).isNotNull();
        assertThat(result.getTeacher_id()).isNull();
        assertThat(result.getUsers()).isEmpty();
    }

    @Test
    void testToEntityList() {
        List<SessionDto> dtoList = Arrays.asList(sessionDto);
        List<Session> result = sessionMapper.toEntity(dtoList);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo(sessionDto.getName());
    }

    @Test
    void testToDtoList() {
        List<Session> sessionList = Arrays.asList(session);
        List<SessionDto> result = sessionMapper.toDto(sessionList);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo(session.getName());
    }

    @Test
    void testToEntityWithNullTeacher() {
        sessionDto.setTeacher_id(null);
        Session result = sessionMapper.toEntity(sessionDto);

        assertThat(result).isNotNull();
        assertThat(result.getTeacher()).isNull();
    }

    @Test
    void testToEntityWithNullUser() {
        when(userService.findById(any())).thenReturn(null);
        Session result = sessionMapper.toEntity(sessionDto);

        assertThat(result).isNotNull();
        assertThat(result.getUsers()).isEmpty();
    }
}
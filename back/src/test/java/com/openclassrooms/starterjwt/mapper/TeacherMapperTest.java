package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.models.Teacher;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class TeacherMapperTest {

    private TeacherMapper teacherMapper = Mappers.getMapper(TeacherMapper.class);
    private Teacher teacher;
    private TeacherDto teacherDto;

    @BeforeEach
    void setUp() {
        LocalDateTime now = LocalDateTime.now();

        teacher = new Teacher();
        teacher.setId(1L);
        teacher.setFirstName("John");
        teacher.setLastName("Doe");
        teacher.setCreatedAt(now);
        teacher.setUpdatedAt(now);

        teacherDto = new TeacherDto();
        teacherDto.setId(1L);
        teacherDto.setFirstName("John");
        teacherDto.setLastName("Doe");
        teacherDto.setCreatedAt(now);
        teacherDto.setUpdatedAt(now);
    }

    @Test
    void testToEntity() {
        Teacher result = teacherMapper.toEntity(teacherDto);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(teacherDto.getId());
        assertThat(result.getFirstName()).isEqualTo(teacherDto.getFirstName());
        assertThat(result.getLastName()).isEqualTo(teacherDto.getLastName());
        assertThat(result.getCreatedAt()).isEqualTo(teacherDto.getCreatedAt());
        assertThat(result.getUpdatedAt()).isEqualTo(teacherDto.getUpdatedAt());
    }

    @Test
    void testToDto() {
        TeacherDto result = teacherMapper.toDto(teacher);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(teacher.getId());
        assertThat(result.getFirstName()).isEqualTo(teacher.getFirstName());
        assertThat(result.getLastName()).isEqualTo(teacher.getLastName());
        assertThat(result.getCreatedAt()).isEqualTo(teacher.getCreatedAt());
        assertThat(result.getUpdatedAt()).isEqualTo(teacher.getUpdatedAt());
    }

    @Test
    void testToEntityWithNullValues() {
        TeacherDto emptyDto = new TeacherDto();
        Teacher result = teacherMapper.toEntity(emptyDto);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isNull();
        assertThat(result.getFirstName()).isNull();
        assertThat(result.getLastName()).isNull();
        assertThat(result.getCreatedAt()).isNull();
        assertThat(result.getUpdatedAt()).isNull();
    }

    @Test
    void testToDtoWithNullValues() {
        Teacher emptyTeacher = new Teacher();
        TeacherDto result = teacherMapper.toDto(emptyTeacher);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isNull();
        assertThat(result.getFirstName()).isNull();
        assertThat(result.getLastName()).isNull();
        assertThat(result.getCreatedAt()).isNull();
        assertThat(result.getUpdatedAt()).isNull();
    }

    @Test
    void testToEntityList() {
        List<TeacherDto> dtoList = Arrays.asList(teacherDto);
        List<Teacher> result = teacherMapper.toEntity(dtoList);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getFirstName()).isEqualTo(teacherDto.getFirstName());
    }

    @Test
    void testToDtoList() {
        List<Teacher> teacherList = Arrays.asList(teacher);
        List<TeacherDto> result = teacherMapper.toDto(teacherList);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getFirstName()).isEqualTo(teacher.getFirstName());
    }
}
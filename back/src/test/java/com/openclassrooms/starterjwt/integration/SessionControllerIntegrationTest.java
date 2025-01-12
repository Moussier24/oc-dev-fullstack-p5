package com.openclassrooms.starterjwt.integration;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import java.util.ArrayList;
import java.util.Date;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.dto.SessionDto;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class SessionControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Session testSession;
    private Teacher testTeacher;
    private User testUser;

    @BeforeEach
    void setUp() {
        // Créer un professeur de test
        testTeacher = new Teacher();
        testTeacher.setFirstName("John");
        testTeacher.setLastName("Doe");
        testTeacher = teacherRepository.save(testTeacher);

        // Créer un utilisateur de test
        testUser = new User();
        testUser.setEmail("test@test.com");
        testUser.setFirstName("Test");
        testUser.setLastName("User");
        testUser.setPassword("password123");
        testUser = userRepository.save(testUser);

        // Créer une session de test
        testSession = new Session();
        testSession.setName("Test Session");
        testSession.setDate(new Date());
        testSession.setDescription("Test Description");
        testSession.setTeacher(testTeacher);
        testSession.setUsers(new ArrayList<>());
        testSession = sessionRepository.save(testSession);
    }

    @Test
    @WithMockUser
    void testFindById_Success() throws Exception {
        mockMvc.perform(get("/api/session/" + testSession.getId())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testSession.getId()))
                .andExpect(jsonPath("$.name").value(testSession.getName()))
                .andExpect(jsonPath("$.description").value(testSession.getDescription()));
    }

    @Test
    @WithMockUser
    void testFindById_NotFound() throws Exception {
        mockMvc.perform(get("/api/session/999999")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser
    void testFindById_InvalidId() throws Exception {
        mockMvc.perform(get("/api/session/invalid")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser
    void testFindAll_Success() throws Exception {
        mockMvc.perform(get("/api/session")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").exists())
                .andExpect(jsonPath("$[0].name").exists())
                .andExpect(jsonPath("$[0].description").exists());
    }

    @Test
    void testFindAll_Unauthorized() throws Exception {
        mockMvc.perform(get("/api/session")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser
    void testCreate_Success() throws Exception {
        SessionDto sessionDto = new SessionDto();
        sessionDto.setName("New Session");
        sessionDto.setDate(new Date());
        sessionDto.setDescription("New Description");
        sessionDto.setTeacher_id(testTeacher.getId());

        mockMvc.perform(post("/api/session")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sessionDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value(sessionDto.getName()))
                .andExpect(jsonPath("$.description").value(sessionDto.getDescription()));
    }

    @Test
    @WithMockUser
    void testUpdate_Success() throws Exception {
        SessionDto sessionDto = new SessionDto();
        sessionDto.setId(testSession.getId());
        sessionDto.setName("Updated Session");
        sessionDto.setDate(new Date());
        sessionDto.setDescription("Updated Description");
        sessionDto.setTeacher_id(testTeacher.getId());

        mockMvc.perform(put("/api/session/" + testSession.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sessionDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value(sessionDto.getName()))
                .andExpect(jsonPath("$.description").value(sessionDto.getDescription()));
    }

    @Test
    @WithMockUser
    void testUpdate_NotFound() throws Exception {
        SessionDto sessionDto = new SessionDto();
        sessionDto.setName("Updated Session");
        sessionDto.setDate(new Date());
        sessionDto.setDescription("Updated Description");
        sessionDto.setTeacher_id(testTeacher.getId());

        mockMvc.perform(put("/api/session/999999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sessionDto)))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser
    void testDelete_Success() throws Exception {
        mockMvc.perform(delete("/api/session/" + testSession.getId())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    void testParticipate_Success() throws Exception {
        mockMvc.perform(post("/api/session/" + testSession.getId() + "/participate/" + testUser.getId())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    void testParticipate_SessionNotFound() throws Exception {
        mockMvc.perform(post("/api/session/999999/participate/" + testUser.getId())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser
    void testNoLongerParticipate_Success() throws Exception {
        // D'abord participer à la session
        mockMvc.perform(post("/api/session/" + testSession.getId() + "/participate/" + testUser.getId())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        // Ensuite ne plus participer
        mockMvc.perform(delete("/api/session/" + testSession.getId() + "/participate/" + testUser.getId())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    void testNoLongerParticipate_SessionNotFound() throws Exception {
        mockMvc.perform(delete("/api/session/999999/participate/" + testUser.getId())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }
}
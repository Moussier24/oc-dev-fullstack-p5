package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.services.SessionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/session")
@Slf4j
public class SessionController {
    private final SessionMapper sessionMapper;
    private final SessionService sessionService;

    public SessionController(SessionMapper sessionMapper, SessionService sessionService) {
        this.sessionMapper = sessionMapper;
        this.sessionService = sessionService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable("id") String id) {
        try {
            Session session = this.sessionService.getById(Long.valueOf(id));
            if (session == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok().body(this.sessionMapper.toDto(session));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("")
    public ResponseEntity<?> findAll() {
        List<Session> sessions = this.sessionService.findAll();
        return ResponseEntity.ok().body(this.sessionMapper.toDto(sessions));
    }

    @PostMapping("")
    public ResponseEntity<?> create(@RequestBody SessionDto sessionDto) {
        log.info("Creating session: {}", sessionDto);
        Session session = this.sessionMapper.toEntity(sessionDto);
        Session created = this.sessionService.create(session);
        return ResponseEntity.ok().body(this.sessionMapper.toDto(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable("id") String id, @RequestBody SessionDto sessionDto) {
        log.info("Updating session: {}", sessionDto);
        try {
            Session session = this.sessionMapper.toEntity(sessionDto);
            Session updated = this.sessionService.update(Long.valueOf(id), session);
            if (updated == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok().body(this.sessionMapper.toDto(updated));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") String id) {
        try {
            this.sessionService.delete(Long.valueOf(id));
            return ResponseEntity.ok().build();
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/participate/{userId}")
    public ResponseEntity<?> participate(@PathVariable("id") String id, @PathVariable("userId") String userId) {
        try {
            this.sessionService.participate(Long.valueOf(id), Long.valueOf(userId));
            return ResponseEntity.ok().build();
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}/participate/{userId}")
    public ResponseEntity<?> noLongerParticipate(@PathVariable("id") String id, @PathVariable("userId") String userId) {
        try {
            this.sessionService.noLongerParticipate(Long.valueOf(id), Long.valueOf(userId));
            return ResponseEntity.ok().build();
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}

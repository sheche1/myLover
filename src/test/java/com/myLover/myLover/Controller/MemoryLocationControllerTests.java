package com.myLover.myLover.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.myLover.lover.model.MemoryLocation;
import com.myLover.lover.model.User;
import com.myLover.lover.repository.MemoryLocationRepository;
import com.myLover.lover.repository.UserRepository;
import com.myLover.lover.service.FileStorageService;
import com.myLover.myLover.TestSecurityConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Optional;

import static java.util.Collections.emptyList;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Import(TestSecurityConfig.class)
class MemoryLocationControllerTests {

    @Autowired private MockMvc mvc;
    @Autowired private ObjectMapper mapper;

    @MockBean private MemoryLocationRepository repo;
    @MockBean private UserRepository userRepo;
    @MockBean private FileStorageService fileSrv;

    private User usr() {
        User u = new User();
        u.setId(1L);
        u.setEmail("a@mail.com");
        return u;
    }

    private MemoryLocation loc() {
        MemoryLocation l = new MemoryLocation();
        l.setId(1L);
        l.setTitle("site");
        l.setDescription("desc");
        l.setDateVisited(LocalDate.now());
        l.setLatitude(1.0);
        l.setLongitude(2.0);
        l.setUser(usr());
        return l;
    }


    @Test 
    void list401() throws Exception {
        mvc.perform(get("/api/memory-locations"))
           .andExpect(status().isUnauthorized());
    }

    @Test 
    void list404() throws Exception {
        when(userRepo.findByEmail("a@mail.com")).thenReturn(null);
        mvc.perform(get("/api/memory-locations").with(user("a@mail.com")))
           .andExpect(status().isNotFound());
    }

    @Test 
    void list200() throws Exception {
        when(userRepo.findByEmail("a@mail.com")).thenReturn(usr());
        when(repo.findByUser(any())).thenReturn(emptyList());
        mvc.perform(get("/api/memory-locations").with(user("a@mail.com")))
           .andExpect(status().isOk());
    }


    @Test 
    void create401() throws Exception {
        mvc.perform(post("/api/memory-locations").with(csrf())
               .contentType(MediaType.APPLICATION_JSON)
               .content("{}"))
           .andExpect(status().isUnauthorized());
    }
    

    @Test 
    void create404() throws Exception {
        when(userRepo.findByEmail("a@mail.com")).thenReturn(null);
        mvc.perform(post("/api/memory-locations").with(user("a@mail.com")).with(csrf())
               .contentType(MediaType.APPLICATION_JSON)
               .content("{}"))
           .andExpect(status().isNotFound());
    }

    @Test 
    void create200() throws Exception {
        when(userRepo.findByEmail("a@mail.com")).thenReturn(usr());
        when(repo.save(any())).thenReturn(loc());
        mvc.perform(post("/api/memory-locations").with(user("a@mail.com")).with(csrf())
               .contentType(MediaType.APPLICATION_JSON)
               .content(mapper.writeValueAsString(loc())))
           .andExpect(status().isOk());
    }


    @Test 
    void update401() throws Exception {
        mvc.perform(put("/api/memory-locations/1").with(csrf())
               .contentType(MediaType.APPLICATION_JSON).content("{}"))
           .andExpect(status().isUnauthorized());
    }

    @Test 
    void update404User() throws Exception {
        when(userRepo.findByEmail("a@mail.com")).thenReturn(null);
        mvc.perform(put("/api/memory-locations/1").with(user("a@mail.com")).with(csrf())
               .contentType(MediaType.APPLICATION_JSON).content("{}"))
           .andExpect(status().isNotFound());
    }

    @Test 
    void update403() throws Exception {
        User other = new User(); other.setId(2L);
        when(userRepo.findByEmail("a@mail.com")).thenReturn(other);
        when(repo.findById(1L)).thenReturn(Optional.of(loc()));
        mvc.perform(put("/api/memory-locations/1").with(user("a@mail.com")).with(csrf())
               .contentType(MediaType.APPLICATION_JSON)
               .content(mapper.writeValueAsString(loc())))
           .andExpect(status().isForbidden());
    }

    @Test 
    void update200_partialLatLon() throws Exception {
        when(userRepo.findByEmail("a@mail.com")).thenReturn(usr());
        when(repo.findById(1L)).thenReturn(Optional.of(loc()));
        when(repo.save(any())).thenReturn(loc());

        MemoryLocation upd = new MemoryLocation();
        upd.setTitle("new");
        upd.setDescription("new");
        mvc.perform(put("/api/memory-locations/1").with(user("a@mail.com")).with(csrf())
               .contentType(MediaType.APPLICATION_JSON)
               .content(mapper.writeValueAsString(upd)))
           .andExpect(status().isOk());
    }


    @Test 
    void delete401() throws Exception {
        mvc.perform(delete("/api/memory-locations/1").with(csrf()))
           .andExpect(status().isUnauthorized());
    }

    @Test 
    void delete404User() throws Exception {
        when(userRepo.findByEmail("a@mail.com")).thenReturn(null);
        mvc.perform(delete("/api/memory-locations/1").with(user("a@mail.com")).with(csrf()))
           .andExpect(status().isNotFound());
    }

    @Test 
    void delete403() throws Exception {
        User other = new User(); other.setId(2L);
        when(userRepo.findByEmail("a@mail.com")).thenReturn(other);
        when(repo.findById(1L)).thenReturn(Optional.of(loc()));
        mvc.perform(delete("/api/memory-locations/1").with(user("a@mail.com")).with(csrf()))
           .andExpect(status().isForbidden());
    }

    @Test 
    void delete200() throws Exception {
        when(userRepo.findByEmail("a@mail.com")).thenReturn(usr());
        when(repo.findById(1L)).thenReturn(Optional.of(loc()));
        mvc.perform(delete("/api/memory-locations/1").with(user("a@mail.com")).with(csrf()))
           .andExpect(status().isOk());
    }


    @Test 
    void upload401() throws Exception {
        MockMultipartFile f = new MockMultipartFile("file","x.jpg","image/jpeg","x".getBytes());
        mvc.perform(multipart("/api/memory-locations/1/photo").file(f).with(csrf()))
           .andExpect(status().isUnauthorized());
    }

    @Test 
    void upload404User() throws Exception {
        when(userRepo.findByEmail("a@mail.com")).thenReturn(null);
        MockMultipartFile f = new MockMultipartFile("file","x.jpg","image/jpeg","x".getBytes());
        mvc.perform(multipart("/api/memory-locations/1/photo").file(f)
                .with(user("a@mail.com")).with(csrf()))
           .andExpect(status().isNotFound());
    }

    @Test 
    void upload403() throws Exception {
        User other = new User(); other.setId(2L);
        when(userRepo.findByEmail("a@mail.com")).thenReturn(other);
        when(repo.findById(1L)).thenReturn(Optional.of(loc()));
        MockMultipartFile f = new MockMultipartFile("file","x.jpg","image/jpeg","x".getBytes());
        mvc.perform(multipart("/api/memory-locations/1/photo").file(f)
                .with(user("a@mail.com")).with(csrf()))
           .andExpect(status().isForbidden());
    }

    @Test 
    void upload200() throws Exception {
        when(userRepo.findByEmail("a@mail.com")).thenReturn(usr());
        when(repo.findById(1L)).thenReturn(Optional.of(loc()));
        when(fileSrv.store(any())).thenReturn("pic.jpg");
        when(repo.save(any())).thenReturn(loc());

        MockMultipartFile f = new MockMultipartFile("file","pic.jpg",
                                                   MediaType.IMAGE_JPEG_VALUE,
                                                   "x".getBytes());

        mvc.perform(multipart("/api/memory-locations/1/photo").file(f)
                .with(user("a@mail.com")).with(csrf()))
           .andExpect(status().isOk());
    }
}

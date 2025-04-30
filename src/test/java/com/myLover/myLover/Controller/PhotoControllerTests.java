package com.myLover.myLover.Controller;

import com.myLover.lover.model.Photo;
import com.myLover.lover.model.User;
import com.myLover.lover.repository.PhotoRepository;
import com.myLover.lover.repository.UserRepository;
import com.myLover.lover.service.FileStorageService;
import com.myLover.myLover.TestSecurityConfig;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Import(TestSecurityConfig.class)
class PhotoControllerTests {

    @Autowired private MockMvc mvc;
    @MockBean private PhotoRepository photoRepo;
    @MockBean private UserRepository userRepo;
    @MockBean private FileStorageService storage;

    private User mockUser() {
        User u = new User();
        u.setId(1L);
        u.setEmail("a@mail.com");
        return u;
    }

    @Test
    void getUserPhotosOk() throws Exception {
        User u = mockUser();
        when(userRepo.findUserByEmail("a@mail.com")).thenReturn(Optional.of(u));
        when(photoRepo.findAllByUser(u)).thenReturn(List.of(new Photo()));

        mvc.perform(get("/api/photos")
                .with(SecurityMockMvcRequestPostProcessors.user("a@mail.com")))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    void uploadUnauthorized() throws Exception {
        MockMultipartFile f = new MockMultipartFile("file", "img.jpg", "image/jpeg", new byte[]{1});
        mvc.perform(multipart("/api/photos/upload")
                .file(f)
                .param("category", "cat")
                .param("description", "d"))
           .andExpect(status().isUnauthorized());
    }

    @Test
    void uploadUserNotFound() throws Exception {
        MockMultipartFile f = new MockMultipartFile(
                "file","img.jpg","image/jpeg", new byte[]{1});
        when(userRepo.findUserByEmail("a@mail.com")).thenReturn(Optional.empty());
    
        mvc.perform(multipart("/api/photos/upload")
                .file(f)
                .param("category","vacaciones")
                .param("description","d")
                .with(SecurityMockMvcRequestPostProcessors.user("a@mail.com")))
           .andExpect(status().isInternalServerError())   
           .andExpect(content().string(containsString("Usuario no encontrado")));
    }
    

    @Test
    void uploadEmptyFile() throws Exception {
        MockMultipartFile empty = new MockMultipartFile("file", "", "image/jpeg", new byte[]{});
        when(userRepo.findUserByEmail("a@mail.com")).thenReturn(Optional.of(mockUser()));

        mvc.perform(multipart("/api/photos/upload")
                .file(empty)
                .param("category", "cat")
                .param("description", "d")
                .with(SecurityMockMvcRequestPostProcessors.user("a@mail.com")))
           .andExpect(status().isBadRequest())
           .andExpect(content().string("El archivo está vacío"));
    }

    @Test
    void uploadOk() throws Exception {
        User u = mockUser();
        when(userRepo.findUserByEmail("a@mail.com")).thenReturn(Optional.of(u));
        when(storage.store(ArgumentMatchers.any())).thenReturn("file.jpg");
        when(photoRepo.save(ArgumentMatchers.any())).thenReturn(new Photo());

        MockMultipartFile file = new MockMultipartFile("file", "img.jpg", "image/jpeg", new byte[]{1});

        mvc.perform(multipart("/api/photos/upload")
                .file(file)
                .param("category", "c1")
                .param("description", "d")
                .with(SecurityMockMvcRequestPostProcessors.user("a@mail.com")))
           .andExpect(status().isOk())
           .andExpect(content().string(containsString("Imagen subida con éxito")));
    }

    @Test
    void getByCategoryUnauthorized() throws Exception {
        mvc.perform(get("/api/photos/category/vacaciones"))
           .andExpect(status().isUnauthorized());
    }

    @Test
    void getByCategoryOk() throws Exception {
        User u = mockUser();
        when(userRepo.findUserByEmail("a@mail.com")).thenReturn(Optional.of(u));
        when(photoRepo.findAllByUserAndCategory(u, "vacaciones")).thenReturn(List.of(new Photo()));

        mvc.perform(get("/api/photos/category/vacaciones")
                .with(SecurityMockMvcRequestPostProcessors.user("a@mail.com")))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    void deleteUnauthorized() throws Exception {
        mvc.perform(delete("/api/photos/5")).andExpect(status().isUnauthorized());
    }

    @Test
    void deleteForbidden() throws Exception {
        User u = mockUser();
        Photo p = new Photo();
        ReflectionTestUtils.setField(p, "id", 5L);
        User other = new User(); other.setId(2L);
        p.setUser(other);

        when(userRepo.findUserByEmail("a@mail.com")).thenReturn(Optional.of(u));
        when(photoRepo.findById(5L)).thenReturn(Optional.of(p));

        mvc.perform(delete("/api/photos/5")
                .with(SecurityMockMvcRequestPostProcessors.user("a@mail.com")))
           .andExpect(status().isForbidden());
    }

    @Test
    void deleteNotFound() throws Exception {
        when(userRepo.findUserByEmail("a@mail.com")).thenReturn(Optional.of(mockUser()));
        when(photoRepo.findById(5L)).thenReturn(Optional.empty());

        mvc.perform(delete("/api/photos/5")
                .with(SecurityMockMvcRequestPostProcessors.user("a@mail.com")))
           .andExpect(status().isNotFound());
    }

    @Test
    void deleteOk() throws Exception {
        User u = mockUser();
        Photo p = new Photo();
        ReflectionTestUtils.setField(p, "id", 5L);
        p.setUser(u);

        when(userRepo.findUserByEmail("a@mail.com")).thenReturn(Optional.of(u));
        when(photoRepo.findById(5L)).thenReturn(Optional.of(p));

        mvc.perform(delete("/api/photos/5")
                .with(SecurityMockMvcRequestPostProcessors.user("a@mail.com")))
           .andExpect(status().isOk())
           .andExpect(content().string("Foto eliminada con éxito"));
    }
}

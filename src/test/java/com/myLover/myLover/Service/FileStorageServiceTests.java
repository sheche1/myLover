package com.myLover.myLover.Service;

import static org.assertj.core.api.Assertions.*;

import java.nio.file.*;
import org.junit.jupiter.api.*;
import org.springframework.mock.web.MockMultipartFile;

import com.myLover.lover.service.FileStorageService;

class FileStorageServiceTests {

    private FileStorageService storage;

    @BeforeEach
    void setUp() {
        storage = new FileStorageService();
    }

    @Test
    void storeFileOk() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file","photo.jpg","image/jpeg","abc".getBytes());
        String name = storage.store(file);
        assertThat(name).isNotBlank();
        assertThat(Files.exists(Paths.get("uploads").resolve(name))).isTrue();
        Files.deleteIfExists(Paths.get("uploads").resolve(name));
    }

    @Test
    void storeEmptyFile() {
        MockMultipartFile empty = new MockMultipartFile("file","e.txt","text/plain",new byte[0]);
        assertThatThrownBy(() -> storage.store(empty)).isInstanceOf(RuntimeException.class);
    }

    @Test
    void constructorCreatesUploadsDir() {
        Path dir = Paths.get("uploads");
    
        if (Files.exists(dir)) {
            assertThat(Files.isDirectory(dir)).isTrue();
            return;
        }
    
        new FileStorageService();        
        assertThat(Files.exists(dir)).isTrue();
    }
    
    

    @Test
    void storeFileWithoutExtension() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file","readme","text/plain","hello".getBytes());
        String generated = storage.store(file);           
        assertThat(generated).doesNotContain(".");         
        Files.deleteIfExists(Paths.get("uploads").resolve(generated));
    }

}

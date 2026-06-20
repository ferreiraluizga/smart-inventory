package com.ferreiraluizga.smartinventory.config;

import com.ferreiraluizga.smartinventory.entity.Usuario;
import com.ferreiraluizga.smartinventory.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String EMAIL_ADMIN = "admin@smartinventory.com";
    private static final String SENHA_ADMIN = "admin123";

    @Override
    public void run(String... args) throws Exception {
        if (usuarioRepository.findUsuarioByEmail(EMAIL_ADMIN).isEmpty()) {
            Usuario admin = new Usuario();
            admin.setNome("Administrador");
            admin.setEmail(EMAIL_ADMIN);
            admin.setSenha(passwordEncoder.encode(SENHA_ADMIN));
            admin.setDataNasc(new SimpleDateFormat("yyyy-MM-dd").parse("2000-01-01"));
            admin.setCpf("00000000000");

            usuarioRepository.save(admin);
            System.out.println(">> Usuário de teste criado -> email: " + EMAIL_ADMIN + " | senha: " + SENHA_ADMIN);
        }
    }
}
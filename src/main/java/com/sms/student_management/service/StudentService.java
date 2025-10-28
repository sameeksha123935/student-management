package com.sms.student_management.service;

import com.sms.student_management.model.Student;
import com.sms.student_management.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // ✅ Correct search method
    public List<Student> searchStudents(String keyword) {
        return studentRepository.searchStudents(keyword);
    }

    public Student getStudentById(Long id) {
        return studentRepository.findById(id).orElse(null);
    }

    public Student addStudent(Student student) {
        return studentRepository.save(student);
    }

    public Student updateStudent(Long id, Student newStudent) {
        Student existing = studentRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setName(newStudent.getName());
            existing.setEmail(newStudent.getEmail());
            existing.setCourse(newStudent.getCourse());
            existing.setAge(newStudent.getAge());
            return studentRepository.save(existing);
        }
        return null;
    }

    public String deleteStudent(Long id) {
        studentRepository.deleteById(id);
        return "Student deleted successfully!";
    }
}

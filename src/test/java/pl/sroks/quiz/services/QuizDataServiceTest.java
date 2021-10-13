package pl.sroks.quiz.services;

import org.junit.jupiter.api.Test;
import pl.sroks.quiz.dto.CategoryQuestionCountInfoDto;
import pl.sroks.quiz.frontend.Difficulty;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static pl.sroks.quiz.frontend.Difficulty.*;

class QuizDataServiceTest {

    @Test
    void calculateEachDifficultyQuestionCount_basicEasy() {
        CategoryQuestionCountInfoDto categoryQuestionCount = new CategoryQuestionCountInfoDto(5, 17, 13);
        Map<Difficulty, Integer> result = QuizDataService.calculateEachDifficultyQuestionCount(20, EASY, categoryQuestionCount);

        assertEquals(5, result.get(EASY));
        assertEquals(15, result.get(MEDIUM));
        assertNull(result.get(HARD));
    }
}
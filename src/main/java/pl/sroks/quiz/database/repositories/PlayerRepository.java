package pl.sroks.quiz.database.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.sroks.quiz.database.entities.PlayerEntity;

public interface PlayerRepository extends JpaRepository<PlayerEntity, Long> {
}

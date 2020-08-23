package com.asaltech.taskmanagement.gateway;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import org.junit.jupiter.api.Test;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

class ArchTest {

    @Test
    void servicesAndRepositoriesShouldNotDependOnWebLayer() {

        JavaClasses importedClasses = new ClassFileImporter()
            .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
            .importPackages("com.asaltech.taskmanagement.gateway");

        noClasses()
            .that()
                .resideInAnyPackage("com.asaltech.taskmanagement.gateway.service..")
            .or()
                .resideInAnyPackage("com.asaltech.taskmanagement.gateway.repository..")
            .should().dependOnClassesThat()
                .resideInAnyPackage("..com.asaltech.taskmanagement.gateway.web..")
        .because("Services and repositories should not depend on web layer")
        .check(importedClasses);
    }
}

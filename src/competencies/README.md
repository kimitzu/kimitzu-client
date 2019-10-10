# Djali Competency Standard v1.0.0-beta

This document describes the JSON standard for contributing to Djali Competencies.

## Sample JSON

```json
{
    "id": "unique-competency-id",
    "title": "Competency Title",
    "relatedCompetencies": ["prefix", "id"],
    "matrix": [
      {
        "category": "Subcategory Title",
        "subCategories": [
          {
            "item": "Question/Competency Area",
            "questions": [
              "Qualification Level 0",
              "Qualification Level 1",
              "Qualification Level 2",
              "Qualification Level 3"
            ]
          },
          {
            "item": "Another Question",
            "questions": [
                "Qualification Level 0",
              "Qualification Level 1",
              "Qualification Level 2",
              "Qualification Level 3"
            ]
          }
        ]
      }
    ]  
  }
```

## Sections

### ID
A unique, alphanumeric identifier for the competency document.

### Title
The formal title of the competency document. Will be used in headings and sections on the user interface.

### Related Competencies
These are competency IDs that are related to the competency. A comprehensive list can be found at `src/constants/ServiceTypes.json`. 

A related competency is a string that can either be:


1. The exact competency ID.
2. A prefix of a competency ID.

So for example, if we want to restrict it to Medical Doctors, we can fill it up as `["221-0"]`. If we want all the competencies related to software development, using the prefix can also be accepted and we fill it up as `["251", "252"]`.

### Matrix
This contains the formal questionnaire of the competencies. The matrix is an array of Categories that contain Sub-Categories and their corresponding formal label and questions, defined as:

```json
{
  "category": "Subcategory Title",
  "subCategories": [
    {
      "item": "Question/Competency Area",
      "questions": [
        "Qualification Level 0",
        "Qualification Level 1",
        "Qualification Level 2",
        "Qualification Level 3"
      ]
    }
  ]
}
```

For example, `Programmer Competency` can have `Computer Science` as a potential category for a competency questionnaire. Then, that category can be further specified into sub-categories, in this case, `Data Structures`. 

Questions can then be defined to assess the user's level of knowledge via the `questions` field.
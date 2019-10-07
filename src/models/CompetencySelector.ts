import competencies, {
  CompetencyDictionaryInterface,
  CompetencyInterface,
  CompetencySubcategoryInterface,
} from '../competencies'

export interface State {
  competencies: CompetencySelectorInterface[]
}

export interface CompetencySelectorInterface extends CompetencyInterface {
  title: string
  checked: boolean
}

export interface ItemReport {
  item: string
  assessment: number
}

export interface SingleAssessmentSummary {
  category: string
  subCategories: ItemReport[]
}

export interface DescriptionIndexInterface {
  [key: string]: {
    [key: string]: string[]
  }
}

export interface FullAssessmentReportItem {
  item: string
  description: string
  assessment: number
}

export interface FullAssessmentReport {
  category: string
  subCategories: FullAssessmentReportItem[]
}

export interface AssessmentSummary {
  [key: string]: SingleAssessmentSummary[]
}

class CompetencySelectorModel implements State {
  public competencies: CompetencySelectorInterface[] = []
  public competenciesIndex: CompetencyDictionaryInterface = competencies
  public descriptionIndex: DescriptionIndexInterface = {}

  constructor() {
    this.competencies = Object.values(competencies).map((competency, i) => {
      competency.matrix.forEach(matrix => {
        matrix.subCategories.forEach(subCategory => {
          if (!this.descriptionIndex[competency.id]) {
            this.descriptionIndex[competency.id] = {}
          }
          this.descriptionIndex[competency.id][subCategory.item] = subCategory.questions
          subCategory.assessment = -1
        })
      })
      return { ...competency, checked: false, index: i }
    })
  }

  public load(rawCompetency: AssessmentSummary) {
    if (!rawCompetency) {
      return this
    }
    Object.keys(rawCompetency).forEach(selectedCompetency => {
      const competencyIndex = this.competencies.findIndex(el => el.id === selectedCompetency)
      if (competencyIndex === -1) {
        return
      }
      this.competencies[competencyIndex].matrix.forEach((matrix, matrixIndex) => {
        const rawCompetencyCategory = rawCompetency[selectedCompetency][matrixIndex]
        matrix.subCategories.forEach((subCategory, subCategoryIndex) => {
          if (subCategory.item === rawCompetencyCategory.subCategories[subCategoryIndex].item) {
            subCategory.assessment =
              rawCompetencyCategory.subCategories[subCategoryIndex].assessment
          }
        })
      })
      this.setCompetencyCheck(competencyIndex, true)
    })
    return this
  }

  public setCompetencyCheck(index: number, isChecked: boolean) {
    const competencyClone = [...this.competencies]
    const element = competencyClone.splice(index, 1)[0]
    element.checked = isChecked
    if (isChecked) {
      competencyClone.unshift(element)
    } else {
      competencyClone.push(element)
    }
    this.competencies = competencyClone
    return this
  }

  public generateAssessmentSummary(id: string) {
    const assessmentSummary = [] as SingleAssessmentSummary[]
    this.competenciesIndex[id].matrix.forEach(category => {
      const categoryReport = {
        category: category.category,
        subCategories: [] as ItemReport[],
      } as SingleAssessmentSummary
      category.subCategories.forEach(subCategory => {
        const itemReport = {
          item: subCategory.item,
          assessment: subCategory.assessment,
        }
        categoryReport.subCategories.push(itemReport)
      })
      assessmentSummary.push(categoryReport)
    })
    return assessmentSummary
  }

  public generateFullAssessment(id: string, data: SingleAssessmentSummary[]) {
    const report = {
      [id]: {
        title: this.competenciesIndex[id].title,
        relatedCompetencies: this.competenciesIndex[id].relatedCompetencies,
        assessment: [] as FullAssessmentReport[],
      },
    }
    data.forEach(assessment => {
      const assessmentReportCategory = {
        category: assessment.category,
        subCategories: [],
      } as FullAssessmentReport
      assessment.subCategories.forEach(item => {
        const itemReport = {} as FullAssessmentReportItem
        itemReport.item = item.item
        itemReport.description = this.descriptionIndex[id][item.item][item.assessment]
        itemReport.assessment = item.assessment
        assessmentReportCategory.subCategories.push(itemReport)
      })
      report[id].assessment.push(assessmentReportCategory)
    })
    return report
  }

  public getCompetencyIdFromOccupationId(rawId: string) {
    const competencyElement = this.competencies.find(competency => {
      return competency.relatedCompetencies.some((current: string) => {
        return rawId.startsWith(current)
      })
    })
    if (competencyElement) {
      return competencyElement.id
    } else {
      return ''
    }
  }

  public delete(id: string) {
    const competencyIndex = this.competencies.findIndex(el => el.id === id)
    this.setCompetencyCheck(competencyIndex, false)
  }
}

const competencySelectorInstance = new CompetencySelectorModel()
export { competencySelectorInstance, CompetencySelectorModel }

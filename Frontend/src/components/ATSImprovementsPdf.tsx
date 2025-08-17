import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import ATSImprovements from '@/pages/ATSImprovements';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 12,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: 'bold',
    borderBottom: '1px solid #ccc',
    paddingBottom: 5,
  },
  issueCard: {
    marginBottom: 15,
    padding: 10,
    border: '1px solid #eee',
    borderRadius: 5,
  },
  issueText: {
    color: '#e53e3e',
    marginBottom: 5,
  },
  fixText: {
    color: '#38a169',
  },
  keywordItem: {
    marginBottom: 10,
  },
  keyword: {
    backgroundColor: '#f0f0f0',
    padding: '2px 5px',
    borderRadius: 3,
    fontFamily: 'Courier',
  },
  skillCard: {
    marginBottom: 15,
    padding: 10,
    borderLeft: '3px solid #3182ce',
    backgroundColor: '#f8fafc',
  },
  experienceCard: {
    marginBottom: 15,
    padding: 10,
    borderLeft: '3px solid #38a169',
  },
  actionPlanCard: {
    marginBottom: 10,
    padding: 10,
    borderLeft: '3px solid #805ad5',
  },
  timelineBadge: {
    backgroundColor: '#e2e8f0',
    padding: '2px 6px',
    borderRadius: 4,
    fontSize: 10,
    marginBottom: 3,
  },
  
});

interface ImprovementData {
  // Your existing interface
   formattingIssues: {
    problems: string[];
    fixes: string[];
  };
  keywordOptimization: {
    missingKeywords: string[];
    placementSuggestions: string[];
    examples: string[];
  };
  skillPresentation: {
    weakSkills: string[];
    improvedExamples: string[];
  };
  experienceImprovements: {
    weakBullets: string[];
    quantifiedExamples: string[];
  };
  actionPlan: {
    immediate: string[];
    mediumTerm: string[];
    longTerm: string[];
  };
}
export const ATSImprovementsPdf = ({ improvements }: { improvements: ImprovementData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>ATS Compatibility Improvements Report</Text>

      {/* Formatting Issues Section */}
      <Text style={styles.sectionTitle}>Formatting Issues</Text>
      {improvements.formattingIssues.problems.map((problem, i) => (
        <View key={i} style={styles.issueCard}>
          <Text style={styles.issueText}>Issue: {problem}</Text>
          <Text style={styles.fixText}>Fix: {improvements.formattingIssues.fixes[i]}</Text>
        </View>
      ))}

      {/* Keyword Optimization Section */}
      <Text style={styles.sectionTitle}>Keyword Optimization</Text>
      {improvements.keywordOptimization.missingKeywords.map((keyword, i) => (
        <View key={i} style={styles.keywordItem}>
          <Text>
            Add keyword: <Text style={styles.keyword}>{keyword}</Text>
          </Text>
          <Text>Where to add: {improvements.keywordOptimization.placementSuggestions[i]}</Text>
          <Text style={styles.fixText}>Example: {improvements.keywordOptimization.examples[i]}</Text>
        </View>
      ))}

      {/* Add other sections similarly */}
      {/* Skill Presentation Section */}
      <Text style={styles.sectionTitle}>Skill Presentation Improvements</Text>
      {improvements.skillPresentation.weakSkills.map((skill, i) => (
        <View key={i} style={styles.skillCard}>
          <Text style={styles.issueText}>Weak Presentation:</Text>
          <Text style={{ marginBottom: 5 }}>"{skill}"</Text>
          <Text style={styles.fixText}>Improved Version:</Text>
          <Text>"{improvements.skillPresentation.improvedExamples[i]}"</Text>
        </View>
      ))}

      {/* Experience Improvements Section */}
      <Text style={styles.sectionTitle}>Experience Improvements</Text>
      {improvements.experienceImprovements.weakBullets.map((bullet, i) => (
        <View key={i} style={styles.experienceCard}>
          <Text style={styles.issueText}>Weak Bullet Point:</Text>
          <Text style={{ marginBottom: 5, fontStyle: 'italic' }}>"{bullet}"</Text>
          <Text style={styles.fixText}>Quantified Version:</Text>
          <Text>"{improvements.experienceImprovements.quantifiedExamples[i]}"</Text>
        </View>
      ))}

      {/* Action Plan Section */}
      <Text style={styles.sectionTitle}>Improvement Action Plan</Text>
      
      {/* Immediate Fixes */}
      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
          <Text style={{ color: '#38a169' }}>●</Text> Immediate Fixes (Under 1 hour)
        </Text>
        {improvements.actionPlan.immediate.map((item, i) => (
          <View key={`immediate-${i}`} style={styles.actionPlanCard}>
            <Text>✓ {item}</Text>
          </View>
        ))}
      </View>

      {/* Medium Term */}
      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
          <Text style={{ color: '#d69e2e' }}>●</Text> Medium Term (2-3 hours)
        </Text>
        {improvements.actionPlan.mediumTerm.map((item, i) => (
          <View key={`medium-${i}`} style={styles.actionPlanCard}>
            <Text>✓ {item}</Text>
          </View>
        ))}
      </View>

      {/* Long Term */}
      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
          <Text style={{ color: '#805ad5' }}>●</Text> Long Term (Ongoing)
        </Text>
        {improvements.actionPlan.longTerm.map((item, i) => (
          <View key={`long-${i}`} style={styles.actionPlanCard}>
            <Text>✓ {item}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);
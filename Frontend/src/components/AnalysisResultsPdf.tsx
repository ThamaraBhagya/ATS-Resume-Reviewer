import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 12,
    lineHeight: 1.5
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#2b6cb0',
    textDecoration: 'underline'
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30
  },
  scoreCard: {
    width: '30%',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0'
  },
  scoreTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#4a5568'
  },
  scoreValue: {
    fontSize: 12,
    
    color: '#2b6cb0'
  },
  scoreLabel: {
    fontSize: 12,
    color: '#718096'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#2c5282',
    borderBottom: '1px solid #cbd5e0',
    paddingBottom: 5
  },
  skillBadge: {
    backgroundColor: '#ebf8ff',
    color: '#2b6cb0',
    padding: '3px 8px',
    borderRadius: 4,
    marginRight: 5,
    marginBottom: 5,
    fontSize: 10,
    fontFamily: 'Courier'
  },
  missingSkillBadge: {
    backgroundColor: '#fff5f5',
    color: '#c53030',
    border: '1px dashed #e53e3e'
  },
  suggestionItem: {
    marginBottom: 8,
    paddingLeft: 10,
    borderLeft: '3px solid #4299e1'
  },
  twoColumn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15
  },
  column: {
    width: '48%'
  }
});

interface AnalysisResults {
  atsScore: number;
  keywordMatch: number;
  skillCoverage: string;
  suggestions: string[];
  skills: {
    present: string[];
    missing: string[];
  };
 
  
  
}

export const AnalysisResultsPdf = ({ results }: { results: AnalysisResults }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>ATS Analysis Report</Text>

      {/* Score Summary */}
      <View style={styles.scoreContainer}>
        <View style={styles.scoreCard}>
          <Text style={styles.scoreTitle}>ATS Score</Text>
          <Text style={styles.scoreValue}>{results.atsScore}/100</Text>
          <Text style={styles.scoreLabel}>
            {results.atsScore >= 80 ? 'Excellent' : 
             results.atsScore >= 60 ? 'Good' : 
             results.atsScore >= 40 ? 'Fair' : 'Poor'} compatibility
          </Text>
        </View>

        <View style={styles.scoreCard}>
          <Text style={styles.scoreTitle}>Keyword Match</Text>
          <Text style={styles.scoreValue}>{results.keywordMatch}%</Text>
          <Text style={styles.scoreLabel}>
            {results.keywordMatch >= 80 ? 'Strong match' : 
             results.keywordMatch >= 60 ? 'Moderate match' : 'Weak match'}
          </Text>
        </View>

        <View style={styles.scoreCard}>
          <Text style={styles.scoreTitle}>Skill Coverage</Text>
          <Text style={styles.scoreValue}>{results.skillCoverage}</Text>
          <Text style={styles.scoreLabel}>
            {results.skillCoverage.includes('High') ? 'Comprehensive' : 
             results.skillCoverage.includes('Medium') ? 'Partial' : 'Limited'} coverage
          </Text>
        </View>
      </View>

      {/* Skills Analysis */}
      <Text style={styles.sectionTitle}>Skills Analysis</Text>
      
      <View style={styles.twoColumn}>
        <View style={styles.column}>
          <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>✅ Present Skills:</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {results.skills.present.map((skill, i) => (
              <Text key={`present-${i}`} style={styles.skillBadge}>{skill}</Text>
            ))}
          </View>
        </View>

        <View style={styles.column}>
          <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>❌ Missing Skills:</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {results.skills.missing.map((skill, i) => (
              <Text key={`missing-${i}`} style={[styles.skillBadge, styles.missingSkillBadge]}>{skill}</Text>
            ))}
          </View>
        </View>
      </View>

      {/* Suggestions */}
      <Text style={styles.sectionTitle}>Optimization Suggestions</Text>
      {results.suggestions.map((suggestion, i) => (
        <View key={`suggestion-${i}`} style={styles.suggestionItem}>
          <Text>• {suggestion}</Text>
        </View>
      ))}

      {/* Footer */}
      <View style={{ marginTop: 30, textAlign: 'center', fontSize: 10, color: '#718096' }}>
        <Text>Report generated on {new Date().toLocaleDateString()}</Text>
        <Text>ATS Compatibility Analysis Report - Confidential</Text>
      </View>
    </Page>
  </Document>
);
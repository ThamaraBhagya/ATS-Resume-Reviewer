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
    marginBottom: 20,
    textAlign: 'center',
    color: '#2b6cb0'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#2c5282',
    borderBottom: '1px solid #cbd5e0',
    paddingBottom: 5
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: 'semibold',
    marginTop: 15,
    marginBottom: 8,
    color: '#4a5568'
  },
  scoreBadge: {
    backgroundColor: '#ebf8ff',
    color: '#2b6cb0',
    padding: '3px 10px',
    borderRadius: 4,
    fontWeight: 'bold',
    marginBottom: 10
  },
  matchList: {
    marginLeft: 15,
    marginBottom: 10
  },
  matchItem: {
    marginBottom: 5
  },
  gapItem: {
    marginBottom: 5,
    color: '#e53e3e'
  },
  rewriteContainer: {
    marginBottom: 15,
    borderLeft: '3px solid #bee3f8',
    paddingLeft: 10
  },
  rewriteSection: {
    fontWeight: 'bold',
    marginBottom: 3
  },
  beforeAfter: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 5
  },
  before: {
    flex: 1,
    padding: 8,
    backgroundColor: '#fef2f2',
    color: '#e53e3e',
    marginRight: 5,
    borderRadius: 4
  },
  after: {
    flex: 1,
    padding: 8,
    backgroundColor: '#f0fff4',
    color: '#38a169',
    marginLeft: 5,
    borderRadius: 4
  },
  keywordBadge: {
    backgroundColor: '#ebf8ff',
    color: '#2b6cb0',
    padding: '2px 6px',
    borderRadius: 4,
    marginRight: 5,
    fontFamily: 'Courier'
  },
  exampleBlock: {
    backgroundColor: '#f7fafc',
    padding: 8,
    borderRadius: 4,
    marginTop: 5,
    border: '1px solid #e2e8f0'
  },
  tipItem: {
    marginBottom: 8,
    paddingLeft: 10,
    borderLeft: '2px solid #a0aec0'
  }
});
interface JobAlignmentData {
  jobFit: {
    score: number;
    matches: string[];
    gaps: string[];
  };
  tailoring: {
    rewrites: { section: string, before: string, after: string }[];
    additions: { item: string, example: string }[];
    removals: { item: string, reason: string }[];
  };
  keywords: {
    missing: string[];
    placement: { keyword: string, section: string }[];
    examples: string[];
  };
  achievements: {
    current: string[];
    suggested: { statement: string, example: string }[];
    quantificationTips: string[];
  };
  positioning: {
    summary: string;
    reordering: string[];
    emphasis: string[];
  };
}

export const JobAlignmentPdf = ({ data }: { data: JobAlignmentData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Job Alignment Report</Text>

      {/* Job Fit Section */}
      <Text style={styles.sectionTitle}>Job Fit Analysis</Text>
      <View style={styles.scoreBadge}>
        <Text>Alignment Score: {data.jobFit.score}/100</Text>
      </View>
      
      <Text style={styles.subsectionTitle}>Strong Matches:</Text>
      <View style={styles.matchList}>
        {data.jobFit.matches.map((match, i) => (
          <Text key={`match-${i}`} style={styles.matchItem}>✓ {match}</Text>
        ))}
      </View>
      
      <Text style={styles.subsectionTitle}>Potential Gaps:</Text>
      <View style={styles.matchList}>
        {data.jobFit.gaps.map((gap, i) => (
          <Text key={`gap-${i}`} style={styles.gapItem}>⚠️ {gap}</Text>
        ))}
      </View>

      {/* Tailoring Recommendations */}
      <Text style={styles.sectionTitle}>Tailoring Recommendations</Text>
      
      {data.tailoring.rewrites.map((rewrite, i) => (
        <View key={`rewrite-${i}`} style={styles.rewriteContainer}>
          <Text style={styles.rewriteSection}>Section: {rewrite.section}</Text>
          <View style={styles.beforeAfter}>
            <View style={styles.before}>
              <Text style={{ fontWeight: 'bold' }}>Current:</Text>
              <Text>{rewrite.before}</Text>
            </View>
            <View style={styles.after}>
              <Text style={{ fontWeight: 'bold' }}>Suggested:</Text>
              <Text>{rewrite.after}</Text>
            </View>
          </View>
        </View>
      ))}
      
      <Text style={styles.subsectionTitle}>Recommended Additions:</Text>
      {data.tailoring.additions.map((addition, i) => (
        <View key={`add-${i}`} style={{ marginBottom: 10 }}>
          <Text>• {addition.item}</Text>
          <View style={styles.exampleBlock}>
            <Text>Example: {addition.example}</Text>
          </View>
        </View>
      ))}
      
      <Text style={styles.subsectionTitle}>Recommended Removals:</Text>
      {data.tailoring.removals.map((removal, i) => (
        <View key={`remove-${i}`} style={{ marginBottom: 8 }}>
          <Text>• {removal.item}</Text>
          <Text style={{ color: '#718096', fontSize: 10 }}>Reason: {removal.reason}</Text>
        </View>
      ))}

      {/* Keyword Optimization */}
      <Text style={styles.sectionTitle}>Keyword Optimization</Text>
      
      <Text style={styles.subsectionTitle}>Missing Keywords:</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }}>
        {data.keywords.missing.map((keyword, i) => (
          <Text key={`missing-${i}`} style={styles.keywordBadge}>{keyword}</Text>
        ))}
      </View>
      
      <Text style={styles.subsectionTitle}>Recommended Placement:</Text>
      {data.keywords.placement.map((placement, i) => (
        <View key={`place-${i}`} style={{ marginBottom: 8 }}>
          <Text>• Add <Text style={styles.keywordBadge}>{placement.keyword}</Text> to {placement.section}</Text>
        </View>
      ))}
      
      <Text style={styles.subsectionTitle}>Usage Examples:</Text>
      {data.keywords.examples.map((example, i) => (
        <View key={`example-${i}`} style={styles.exampleBlock}>
          <Text>{example}</Text>
        </View>
      ))}

      {/* Achievements Enhancement */}
      <Text style={styles.sectionTitle}>Achievements Enhancement</Text>
      
      <Text style={styles.subsectionTitle}>Current Statements:</Text>
      {data.achievements.current.map((current, i) => (
        <View key={`current-${i}`} style={{ marginBottom: 8 }}>
          <Text>• {current}</Text>
        </View>
      ))}
      
      <Text style={styles.subsectionTitle}>Suggested Improvements:</Text>
      {data.achievements.suggested.map((suggestion, i) => (
        <View key={`suggest-${i}`} style={{ marginBottom: 10 }}>
          <Text>• {suggestion.statement}</Text>
          <View style={styles.exampleBlock}>
            <Text>Example: {suggestion.example}</Text>
          </View>
        </View>
      ))}
      
      <Text style={styles.subsectionTitle}>Quantification Tips:</Text>
      {data.achievements.quantificationTips.map((tip, i) => (
        <Text key={`tip-${i}`} style={styles.tipItem}>• {tip}</Text>
      ))}

      {/* Positioning Strategy */}
      <Text style={styles.sectionTitle}>Positioning Strategy</Text>
      
      <Text style={styles.subsectionTitle}>Summary:</Text>
      <View style={styles.exampleBlock}>
        <Text>{data.positioning.summary}</Text>
      </View>
      
      <Text style={styles.subsectionTitle}>Recommended Reordering:</Text>
      {data.positioning.reordering.map((item, i) => (
        <Text key={`reorder-${i}`} style={{ marginBottom: 5 }}>• {item}</Text>
      ))}
      
      <Text style={styles.subsectionTitle}>Elements to Emphasize:</Text>
      {data.positioning.emphasis.map((item, i) => (
        <Text key={`emphasis-${i}`} style={{ marginBottom: 5 }}>• {item}</Text>
      ))}
    </Page>
  </Document>
);
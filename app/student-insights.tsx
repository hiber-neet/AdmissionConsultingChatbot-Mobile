import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  Users,
  TrendingUp,
  Globe,
  BookOpen,
  Target,
  MapPin,
  Calendar,
  Award,
  CheckCircle2,
  Clock,
  XCircle,
  BarChart3,
  PieChart,
  ArrowUp,
  ArrowDown,
  Eye,
  MessageSquare,
} from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');

interface InsightData {
  label: string;
  value: number;
  change: number;
  color: string;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface ProgramData {
  program: string;
  count: number;
  growth: number;
}

interface GeographicData {
  location: string;
  count: number;
  percentage: number;
}

const keyMetrics: InsightData[] = [
  { label: 'Tổng Lượt Truy Cập', value: 10040, change: 24, color: '#3B82F6' },
  { label: 'Ứng Viên Mới', value: 1256, change: 18, color: '#10B981' },
  { label: 'Hồ Sơ Hoàn Thành', value: 892, change: 12, color: '#F59E0B' },
  { label: 'Tỷ Lệ Duyệt', value: 67.8, change: -3.2, color: '#8B5CF6' },
];

const statusData: ChartData[] = [
  { name: 'Đã Duyệt', value: 45, color: '#10B981' },
  { name: 'Đang Xét', value: 30, color: '#3B82F6' },
  { name: 'Chờ Xử Lý', value: 15, color: '#F59E0B' },
  { name: 'Từ Chối', value: 10, color: '#EF4444' },
];

const programInterests: ProgramData[] = [
  { program: 'Khoa học Máy tính', count: 1240, growth: 18 },
  { program: 'Quản trị Kinh doanh', count: 980, growth: 12 },
  { program: 'Kỹ thuật', count: 850, growth: 15 },
  { program: 'Khoa học Dữ liệu', count: 720, growth: 25 },
  { program: 'MBA', count: 650, growth: 8 },
  { program: 'Tài chính', count: 540, growth: -3 },
];

const geographicData: GeographicData[] = [
  { location: 'Hà Nội', count: 2520, percentage: 35 },
  { location: 'TP. Hồ Chí Minh', count: 1890, percentage: 26 },
  { location: 'Đà Nẵng', count: 980, percentage: 14 },
  { location: 'Cần Thơ', count: 650, percentage: 9 },
  { location: 'Hải Phòng', count: 480, percentage: 7 },
  { location: 'Khác', count: 680, percentage: 9 },
];

const topPages = [
  { page: 'Học Bổng Toàn Phần', views: 8420, avgTime: '4:32' },
  { page: 'Yêu Cầu Tuyển Sinh', views: 7280, avgTime: '3:45' },
  { page: 'Hướng Dẫn Visa', views: 6890, avgTime: '5:18' },
  { page: 'Chi Phí & Học Phí', views: 6120, avgTime: '3:22' },
  { page: 'Chương Trình MBA', views: 5680, avgTime: '4:05' },
];

const monthlyData = [
  { month: 'T6', applications: 420, inquiries: 680 },
  { month: 'T7', applications: 450, inquiries: 720 },
  { month: 'T8', applications: 580, inquiries: 890 },
  { month: 'T9', applications: 620, inquiries: 920 },
  { month: 'T10', applications: 680, inquiries: 1050 },
];

export default function StudentInsightsScreen() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter'>('month');

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatPercentage = (num: number) => {
    return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`;
  };

  const renderMetricCard = (metric: InsightData, index: number) => {
    const isPercentage = metric.label.includes('Tỷ Lệ');
    const displayValue = isPercentage ? `${metric.value}%` : formatNumber(metric.value);
    const changeColor = metric.change >= 0 ? '#10B981' : '#EF4444';
    const ChangeIcon = metric.change >= 0 ? ArrowUp : ArrowDown;

    return (
      <View key={index} style={[styles.metricCard, { borderLeftColor: metric.color }]}>
        <View style={styles.metricHeader}>
          <Text style={styles.metricLabel}>{metric.label}</Text>
          <View style={[styles.metricIcon, { backgroundColor: metric.color + '20' }]}>
            {index === 0 && <Users size={16} color={metric.color} />}
            {index === 1 && <TrendingUp size={16} color={metric.color} />}
            {index === 2 && <CheckCircle2 size={16} color={metric.color} />}
            {index === 3 && <Target size={16} color={metric.color} />}
          </View>
        </View>
        <Text style={styles.metricValue}>{displayValue}</Text>
        <View style={styles.metricChange}>
          <ChangeIcon size={12} color={changeColor} />
          <Text style={[styles.changeText, { color: changeColor }]}>
            {formatPercentage(Math.abs(metric.change))}
          </Text>
          <Text style={styles.changePeriod}>so với tháng trước</Text>
        </View>
      </View>
    );
  };

  const renderSimpleChart = (data: ChartData[], title: string) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    return (
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>{title}</Text>
          <PieChart size={16} color="#6B7280" />
        </View>
        <View style={styles.chartContent}>
          {data.map((item, index) => (
            <View key={index} style={styles.chartItem}>
              <View style={styles.chartItemHeader}>
                <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                <Text style={styles.chartItemLabel}>{item.name}</Text>
                <Text style={styles.chartItemValue}>{item.value}%</Text>
              </View>
              <View style={styles.chartBar}>
                <View
                  style={[
                    styles.chartBarFill,
                    { width: `${item.value}%`, backgroundColor: item.color }
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderProgramCard = () => {
    return (
      <View style={styles.listCard}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Chương Trình Phổ Biến</Text>
          <BookOpen size={16} color="#6B7280" />
        </View>
        <View style={styles.listContent}>
          {programInterests.slice(0, 5).map((program, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.listItemInfo}>
                <Text style={styles.listItemTitle}>{program.program}</Text>
                <Text style={styles.listItemSubtitle}>{formatNumber(program.count)} ứng viên</Text>
              </View>
              <View style={[styles.growthBadge, { 
                backgroundColor: program.growth >= 0 ? '#DCFCE7' : '#FEE2E2' 
              }]}>
                <Text style={[styles.growthText, { 
                  color: program.growth >= 0 ? '#16A34A' : '#DC2626' 
                }]}>
                  {program.growth >= 0 ? '+' : ''}{program.growth}%
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderGeographicCard = () => {
    return (
      <View style={styles.listCard}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Phân Bố Địa Lý</Text>
          <MapPin size={16} color="#6B7280" />
        </View>
        <View style={styles.listContent}>
          {geographicData.map((location, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.listItemInfo}>
                <Text style={styles.listItemTitle}>{location.location}</Text>
                <Text style={styles.listItemSubtitle}>{formatNumber(location.count)} học sinh</Text>
              </View>
              <View style={styles.percentageBadge}>
                <Text style={styles.percentageText}>{location.percentage}%</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderTopPagesCard = () => {
    return (
      <View style={styles.listCard}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Trang Được Xem Nhiều</Text>
          <Eye size={16} color="#6B7280" />
        </View>
        <View style={styles.listContent}>
          {topPages.map((page, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.pageRank}>
                <Text style={styles.pageRankText}>{index + 1}</Text>
              </View>
              <View style={styles.listItemInfo}>
                <Text style={styles.listItemTitle}>{page.page}</Text>
                <Text style={styles.listItemSubtitle}>
                  {formatNumber(page.views)} lượt xem • {page.avgTime}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderTrendChart = () => {
    const maxValue = Math.max(...monthlyData.map(item => Math.max(item.applications, item.inquiries)));
    
    return (
      <View style={styles.trendCard}>
        <View style={styles.trendHeader}>
          <Text style={styles.trendTitle}>Xu Hướng Theo Tháng</Text>
          <View style={styles.timeframePicker}>
            {(['week', 'month', 'quarter'] as const).map((timeframe) => (
              <TouchableOpacity
                key={timeframe}
                style={[
                  styles.timeframeButton,
                  selectedTimeframe === timeframe && styles.activeTimeframeButton
                ]}
                onPress={() => setSelectedTimeframe(timeframe)}
              >
                <Text style={[
                  styles.timeframeText,
                  selectedTimeframe === timeframe && styles.activeTimeframeText
                ]}>
                  {timeframe === 'week' ? 'Tuần' : timeframe === 'month' ? 'Tháng' : 'Quý'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.trendLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
            <Text style={styles.legendText}>Đơn đăng ký</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.legendText}>Lượt tư vấn</Text>
          </View>
        </View>

        <View style={styles.chartContainer}>
          {monthlyData.map((data, index) => (
            <View key={index} style={styles.barGroup}>
              <View style={styles.barContainer}>
                <View 
                  style={[
                    styles.bar,
                    { 
                      height: (data.applications / maxValue) * 80,
                      backgroundColor: '#3B82F6'
                    }
                  ]} 
                />
                <View 
                  style={[
                    styles.bar,
                    { 
                      height: (data.inquiries / maxValue) * 80,
                      backgroundColor: '#10B981',
                      marginLeft: 4
                    }
                  ]} 
                />
              </View>
              <Text style={styles.barLabel}>{data.month}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thông Tin Học Sinh</Text>
        <Text style={styles.headerSubtitle}>
          Phân tích xu hướng quan tâm và hành vi của sinh viên
        </Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Key Metrics Grid */}
        <View style={styles.metricsGrid}>
          {keyMetrics.map((metric, index) => renderMetricCard(metric, index))}
        </View>

        {/* Status Distribution Chart */}
        {renderSimpleChart(statusData, 'Phân Bố Trạng Thái Hồ Sơ')}

        {/* Trend Chart */}
        {renderTrendChart()}

        {/* Program Popularity */}
        {renderProgramCard()}

        {/* Geographic Distribution */}
        {renderGeographicCard()}

        {/* Top Pages */}
        {renderTopPagesCard()}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  scrollContainer: {
    flex: 1,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 12,
  },
  metricCard: {
    width: (screenWidth - 52) / 2,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    flex: 1,
  },
  metricIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  metricChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  changeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  changePeriod: {
    fontSize: 10,
    color: '#6B7280',
    marginLeft: 4,
  },
  chartCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  chartContent: {
    gap: 12,
  },
  chartItem: {
    gap: 6,
  },
  chartItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  chartItemLabel: {
    fontSize: 13,
    color: '#374151',
    flex: 1,
  },
  chartItemValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  chartBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  chartBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  listCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  listContent: {
    gap: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listItemInfo: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  listItemSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  growthBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  growthText: {
    fontSize: 11,
    fontWeight: '600',
  },
  percentageBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  percentageText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
  },
  pageRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  pageRankText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  trendCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  trendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  trendTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  timeframePicker: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 2,
  },
  timeframeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  activeTimeframeButton: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  timeframeText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTimeframeText: {
    color: '#374151',
  },
  trendLegend: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
    paddingHorizontal: 10,
  },
  barGroup: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 80,
    marginBottom: 8,
  },
  bar: {
    width: 12,
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
  barLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  bottomPadding: {
    height: 40,
  },
});
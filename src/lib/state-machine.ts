/**
 * 10阶段状态机 — 配方开发SOP编排引擎
 * 
 * 核心约束：
 * 1. 状态机为王 — status字段是唯一进度控制源
 * 2. Schema即合同 — 输出必须通过验证才能写入
 * 3. AI是执行者不是决策者 — 判断逻辑用确定性代码
 * 4. 人工卡点可跳过但推荐审核 — Stage 3、Stage 7 和 Stage 9
 * 5. 经验数据库是全局资源 — 跨项目共享
 */

export type ProjectStatus =
  | 'stage_1_demand'
  | 'stage_2_scan'
  | 'stage_3_deliverables'
  | 'stage_3_awaiting_confirm'
  | 'stage_4_pathway'
  | 'stage_5_ingredients'
  | 'stage_6_regulatory'
  | 'stage_7_formulation'
  | 'stage_7_awaiting_confirm'
  | 'stage_8_audit'
  | 'stage_9_engineering'
  | 'stage_9_awaiting_confirm'
  | 'stage_10_proposal'
  | 'completed';

export interface StageInfo {
  number: number;
  label: string;
  labelEn: string;
  description: string;
  isHumanCheckpoint: boolean;
}

export const STAGES: StageInfo[] = [
  { number: 1, label: '需求锚定', labelEn: 'Demand Anchoring', description: '四维定位（WHO/WHAT/WHY/WHERE）', isHumanCheckpoint: false },
  { number: 2, label: '品类扫描', labelEn: 'Category Scan', description: '≥5款竞品 + 通路空位 + 剂量空位 + 叙事空位', isHumanCheckpoint: false },
  { number: 3, label: '三层交付物', labelEn: 'Three-Layer Deliverables', description: '产品需求确认表 + 理论基础 + 消费者迷思', isHumanCheckpoint: true },
  { number: 4, label: '通路推导', labelEn: 'Pathway Derivation', description: '6步法：锚定→绘制→识别→筛选→检验→定权', isHumanCheckpoint: false },
  { number: 5, label: '候选成分库', labelEn: 'Ingredient Universe', description: '穷举+擂台赛+剂量分级+合规批量验证', isHumanCheckpoint: false },
  { number: 6, label: '合规前置', labelEn: 'Regulatory Gate', description: '内地/香港/跨境三市场逐成分确认', isHumanCheckpoint: false },
  { number: 7, label: '配方定型', labelEn: 'Formula Lock', description: '七问审计+拮抗排查+三方案+三色通行证', isHumanCheckpoint: true },
  { number: 8, label: '体感审计', labelEn: 'Sensory Audit', description: '4.0六步+4.5七铁律交叉验证', isHumanCheckpoint: false },
  { number: 9, label: '全链路工程', labelEn: 'Engineering', description: '成本核算+生产SOP+剂量安全性验证', isHumanCheckpoint: true },
  { number: 10, label: '客户提报', labelEn: 'Client Proposal', description: '11章McKinsey框架文档生成', isHumanCheckpoint: false },
];

export type DoseGrade = '⚫' | '🔴' | '🟡' | '✅' | '★';

/** 铁律5：装饰性添加检测 */
export function checkDecorativeDose(proposed: number, effective: number): DoseGrade {
  if (effective <= 0) return '✅';
  const ratio = proposed / effective;
  if (ratio < 0.20) return '⚫'; // 装饰性 → 强制移除
  if (ratio < 0.50) return '🔴'; // 低效 → 警告
  if (ratio < 0.80) return '🟡'; // 亚临床
  if (ratio < 1.00) return '✅'; // 达标
  return '★';                     // 超满配
}

/** 三色通行证判定 */
export type EvidenceColor = '🟢' | '🟡' | '🔴';

export function getEvidenceColor(hasDirectRCT: boolean, hasRelatedRCT: boolean): EvidenceColor {
  if (hasDirectRCT) return '🟢';
  if (hasRelatedRCT) return '🟡';
  return '🔴';
}

/** 三条底线检查 */
export interface ThreeBottomLineResult {
  passed: boolean;
  redRatio: number;        // 🔴占比
  corePathwayAllRed: boolean;
  redSafetyIssue: boolean;
  violations: string[];
}

export function checkThreeBottomLines(
  ingredients: { evidenceColor: EvidenceColor; isCorePath: boolean; safetyGrade: string }[]
): ThreeBottomLineResult {
  const total = ingredients.length;
  const redCount = ingredients.filter(i => i.evidenceColor === '🔴').length;
  const redRatio = total > 0 ? redCount / total : 0;
  
  const coreIngredients = ingredients.filter(i => i.isCorePath);
  const corePathwayAllRed = coreIngredients.length > 0 && coreIngredients.every(i => i.evidenceColor === '🔴');
  
  const redIngredients = ingredients.filter(i => i.evidenceColor === '🔴');
  const redSafetyIssue = redIngredients.some(i => i.safetyGrade !== '✅');

  const violations: string[] = [];
  if (redRatio > 0.5) violations.push('🔴成分超过总数50%');
  if (corePathwayAllRed) violations.push('核心通路成分全为🔴');
  if (redSafetyIssue) violations.push('🔴成分存在安全性问题');

  return {
    passed: violations.length === 0,
    redRatio,
    corePathwayAllRed,
    redSafetyIssue,
    violations,
  };
}

/** 状态转换映射 */
interface TransitionRule {
  from: ProjectStatus;
  to: ProjectStatus;
  requiresHumanConfirm: boolean;
}

const TRANSITIONS: TransitionRule[] = [
  { from: 'stage_1_demand', to: 'stage_2_scan', requiresHumanConfirm: false },
  { from: 'stage_2_scan', to: 'stage_3_deliverables', requiresHumanConfirm: false },
  { from: 'stage_3_deliverables', to: 'stage_3_awaiting_confirm', requiresHumanConfirm: false },
  { from: 'stage_3_awaiting_confirm', to: 'stage_4_pathway', requiresHumanConfirm: true },
  { from: 'stage_4_pathway', to: 'stage_5_ingredients', requiresHumanConfirm: false },
  { from: 'stage_5_ingredients', to: 'stage_6_regulatory', requiresHumanConfirm: false },
  { from: 'stage_6_regulatory', to: 'stage_7_formulation', requiresHumanConfirm: false },
  { from: 'stage_7_formulation', to: 'stage_7_awaiting_confirm', requiresHumanConfirm: false },
  { from: 'stage_7_awaiting_confirm', to: 'stage_8_audit', requiresHumanConfirm: true },
  { from: 'stage_8_audit', to: 'stage_9_engineering', requiresHumanConfirm: false },
  { from: 'stage_9_engineering', to: 'stage_9_awaiting_confirm', requiresHumanConfirm: false },
  { from: 'stage_9_awaiting_confirm', to: 'stage_10_proposal', requiresHumanConfirm: true },
  { from: 'stage_10_proposal', to: 'completed', requiresHumanConfirm: false },
];

export function canTransition(from: ProjectStatus, to: ProjectStatus): boolean {
  return TRANSITIONS.some(t => t.from === from && t.to === to);
}

export function getNextStatus(current: ProjectStatus): ProjectStatus | null {
  const rule = TRANSITIONS.find(t => t.from === current);
  return rule ? rule.to : null;
}

export function requiresHumanConfirm(from: ProjectStatus, to: ProjectStatus): boolean {
  const rule = TRANSITIONS.find(t => t.from === from && t.to === to);
  return rule?.requiresHumanConfirm ?? false;
}

export function getStageNumber(status: ProjectStatus): number {
  const map: Record<ProjectStatus, number> = {
    'stage_1_demand': 1,
    'stage_2_scan': 2,
    'stage_3_deliverables': 3,
    'stage_3_awaiting_confirm': 3,
    'stage_4_pathway': 4,
    'stage_5_ingredients': 5,
    'stage_6_regulatory': 6,
    'stage_7_formulation': 7,
    'stage_7_awaiting_confirm': 7,
    'stage_8_audit': 8,
    'stage_9_engineering': 9,
    'stage_9_awaiting_confirm': 9,
    'stage_10_proposal': 10,
    'completed': 10,
  };
  return map[status];
}

export function isAwaitingConfirm(status: ProjectStatus): boolean {
  return status === 'stage_3_awaiting_confirm' || status === 'stage_7_awaiting_confirm' || status === 'stage_9_awaiting_confirm';
}

/** Get checkpoint info for display */
export function getCheckpointInfo(status: ProjectStatus): { title: string; description: string; reviewFocus: string } | null {
  switch (status) {
    case 'stage_3_awaiting_confirm':
      return {
        title: '定位确认审核',
        description: '产品定位、理论基础与消费者迷思文档已生成，提交配方师团队审核',
        reviewFocus: '审核重点：定位精准度 · 品类知识完整性 · 消费者认知策略',
      };
    case 'stage_7_awaiting_confirm':
      return {
        title: '配方审核',
        description: '配方定型 + 七问审计 + 拮抗排查已完成，提交资深配方师审核',
        reviewFocus: '审核重点：成分配比 · 证据链完整性 · 协同/拮抗 · 三色通行证',
      };
    case 'stage_9_awaiting_confirm':
      return {
        title: '工程终审',
        description: '成本核算 + 生产SOP + 安全性验证已完成，提交工程团队终审',
        reviewFocus: '审核重点：成本合理性 · 工艺可行性 · 安全性数据 · 合规标签',
      };
    default:
      return null;
  }
}

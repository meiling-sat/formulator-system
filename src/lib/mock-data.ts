/**
 * FV-PELVIC-001 Demo Project — 女性盆底生态营养
 * 预填数据用于Phase 1 MVP验证交互逻辑
 */

import type { ProjectStatus } from './state-machine';

export interface Project {
  id: string;
  code: string;
  name: string;
  status: ProjectStatus;
  currentStage: number;
  createdAt: string;
  updatedAt: string;
  stages: Record<number, StageData>;
}

export interface StageData {
  completed: boolean;
  data: Record<string, unknown>;
}

export const DEMO_PROJECT: Project = {
  id: 'demo-pelvic-001',
  code: 'FV-PELVIC-001',
  name: '女性盆底生态营养配方',
  status: 'stage_1_demand',
  currentStage: 1,
  createdAt: '2026-05-20T10:00:00Z',
  updatedAt: '2026-06-02T14:00:00Z',
  stages: {
    1: {
      completed: false,
      data: {
        who: { description: '产后6月-5年女性，有盆底松弛/漏尿/性功能下降困扰', locked: true },
        what: { description: '盆底肌力恢复+泌尿道舒适+私密黏膜润泽', locked: true },
        why: { description: '香港市场·膳食补充剂·OTC级', locked: true },
        where: { description: '与FV-MEC-002私密微生态形成产品线矩阵', locked: true },
        category: '女性盆底健康',
        dosage_form: '胶囊/片剂',
        price_range: 'HKD 398-498',
        target_markets: ['香港'],
      },
    },
    2: {
      completed: false,
      data: {
        competitors: [
          { brand: 'Ellura', product: '盆底修护胶囊', price: 'HKD 380', ingredients_count: 5, audit_score: 4.5 },
          { brand: 'Intimate Rose', product: 'Pelvic Floor Vitamin', price: 'USD 35', ingredients_count: 8, audit_score: 5.2 },
          { brand: 'Kegel8', product: 'Pelvic Health Supplement', price: 'GBP 25', ingredients_count: 6, audit_score: 4.8 },
          { brand: 'Bonafide', product: 'Ristela', price: 'USD 45', ingredients_count: 1, audit_score: 6.0 },
          { brand: 'AZO', product: 'Bladder Control', price: 'USD 20', ingredients_count: 3, audit_score: 5.0 },
        ],
        pathway_gaps: ['筋膜胶原合成通路（竞品0覆盖）', '肌肉能量代谢通路（仅1款触及）', '神经-肌肉信号通路（0覆盖）'],
        dosage_gaps: ['胶原肽多数<2g/日（有效量5-10g）', '蔓越莓PAC多数<36mg'],
        narrative_gaps: ['无竞品提出"盆底生态"整体概念', '无竞品建立盆底肌力+私密+泌尿三维联动叙事'],
        structural_opportunity: '品类空白：目前无口服产品整合"盆底支撑力+肌力+泌尿+黏膜"四维功效',
      },
    },
    3: {
      completed: false,
      data: {
        layer1: {
          title: '产品需求确认表',
          status: 'generated',
          summary: '四维定位已锁定：产后女性·盆底四维修护·香港OTC·产品线协同',
        },
        layer2: {
          title: '盆底生态理论基础',
          status: 'generated',
          summary: '盆底解剖→损伤机制→修复通路→口服干预窗口',
        },
        layer3: {
          title: '盆底健康的六个迷思',
          status: 'generated',
          summary: '做凯格尔就够了？生完孩子才需要？漏尿是正常衰老？...',
        },
      },
    },
    4: {
      completed: false,
      data: {
        sources: [
          { title: 'Pelvic Floor Disorders: Pathophysiology and Management (Springer, 2023)', type: 'textbook' },
          { title: 'DeLancey 2023: Structural support of the urethra — an update', type: 'review' },
          { title: 'Dietz 2022: Pelvic floor trauma — birth-related injury', type: 'review' },
        ],
        final_pathways: [
          { id: 'P1', name: '筋膜胶原合成', tier: 'core', description: '盆底筋膜修复→支撑力重建' },
          { id: 'P2', name: '肌力与耐力', tier: 'core', description: '肌肉能量代谢+收缩力' },
          { id: 'P3', name: '泌尿道/膀胱舒适', tier: 'core', description: '膀胱壁抗刺激+括约肌协调' },
          { id: 'P4', name: '私密黏膜润泽与屏障', tier: 'auxiliary', description: '阴道黏膜修复+天然屏障维护' },
        ],
      },
    },
    5: {
      completed: false,
      data: {
        candidates: [
          { name: '盆力得® (Pelvilen® Dual-Act)', pathway: 'P1+P2', dose_proposed: 100, dose_effective: 100, grade: '★', color: '🟢' },
          { name: '维生素C (EC包衣)', pathway: 'P1', dose_proposed: 500, dose_effective: 500, grade: '★', color: '🟢' },
          { name: '角豆提取物', pathway: 'P1辅助', dose_proposed: 150, dose_effective: 200, grade: '🟡', color: '🟡' },
          { name: 'β-丙氨酸', pathway: 'P2', dose_proposed: 0, dose_effective: 1600, grade: '⚫', color: '🟡', excluded: true, reason: '有效剂量占位过大+可能刺痒' },
          { name: '蔓越莓PAC (36mg)', pathway: 'P3', dose_proposed: 36, dose_effective: 36, grade: '★', color: '🟢' },
          { name: 'D-甘露糖', pathway: 'P3', dose_proposed: 2000, dose_effective: 2000, grade: '★', color: '🟢' },
          { name: '透明质酸钠 (≤10kDa)', pathway: 'P4', dose_proposed: 120, dose_effective: 120, grade: '✅', color: '🟡' },
          { name: '乳酸菌(GR-1+RC-14)', pathway: 'P4', dose_proposed: 10, dose_effective: 10, grade: '★', color: '🟢', unit: 'B CFU' },
        ],
      },
    },
    6: {
      completed: false,
      data: {
        results: [
          { name: '盆力得® Pelvilen® Dual-Act', hk: '✅', mainland: '新食品原料(待确认)', cross_border: '✅' },
          { name: '维生素C', hk: '✅', mainland: '✅', cross_border: '✅' },
          { name: '角豆提取物', hk: '✅', mainland: '普通食品', cross_border: '✅' },
          { name: '蔓越莓PAC', hk: '✅', mainland: '✅', cross_border: '✅' },
          { name: 'D-甘露糖', hk: '✅', mainland: '新食品原料', cross_border: '✅' },
          { name: '透明质酸钠', hk: '✅', mainland: '✅(≤200mg)', cross_border: '✅' },
          { name: '乳酸菌GR-1+RC-14', hk: '✅', mainland: '⚠️(需菌株备案)', cross_border: '✅' },
        ],
        all_passed: true,
      },
    },
    7: {
      completed: false,
      data: {
        final_formula: {
          name: '盆底生态营养配方 V1.2',
          ingredients: [
            { name: '盆力得® (Pelvilen®)', dose: '100mg', pathway: 'P1+P2', color: '🟢', q_score: '7/7' },
            { name: '维生素C (EC包衣)', dose: '500mg', pathway: 'P1', color: '🟢', q_score: '7/7' },
            { name: '角豆提取物', dose: '150mg', pathway: 'P1辅助', color: '🟡', q_score: '5/7' },
            { name: '蔓越莓PAC', dose: '36mg PAC', pathway: 'P3', color: '🟢', q_score: '7/7' },
            { name: 'D-甘露糖', dose: '2000mg', pathway: 'P3', color: '🟢', q_score: '6/7' },
            { name: '透明质酸钠 (≤10kDa)', dose: '120mg', pathway: 'P4', color: '🟡', q_score: '5/7' },
            { name: '乳酸菌 GR-1+RC-14', dose: '10B CFU', pathway: 'P4', color: '🟢', q_score: '7/7' },
          ],
          three_color_summary: { green: 5, yellow: 2, red: 0 },
          antagonism: '0对拮抗 / 3对协同 / 18对中性',
        },
      },
    },
    8: {
      completed: false,
      data: {
        scores: {
          bioavailability: 8,
          dose_sufficiency: 9,
          evidence_chain: 7.5,
          sensory_timeline: 8,
          oral_exclusive: 8.5,
          total: 8.2,
        },
        verdict: 'pass',
        timeline: [
          { period: '1-7天', effect: '泌尿舒适感改善（D-甘露糖+蔓越莓快速起效）', confidence: 'high' },
          { period: '2-4周', effect: '私密润泽感提升（HA+益生菌定植）', confidence: 'medium' },
          { period: '6-8周', effect: '盆底肌力改善（盆力得核心周期）', confidence: 'high' },
          { period: '12周+', effect: '支撑力结构性恢复（胶原合成积累）', confidence: 'medium' },
        ],
        iron_rules: [
          { rule: 1, name: '证据归属', score: 9, note: '盆力得有品牌RCT' },
          { rule: 2, name: '少而足', score: 8, note: '7成分覆盖4通路，无多余' },
          { rule: 3, name: '剂型匹配', score: 7, note: 'D-甘露糖2g需粉剂分装' },
          { rule: 4, name: '故事成分', score: 9, note: '0故事成分' },
          { rule: 5, name: '装饰性添加', score: 9, note: '0装饰性(⚫)' },
          { rule: 6, name: '竞品审计', score: 8, note: '5款竞品均完成铁律审计' },
          { rule: 7, name: '口服独占', score: 8, note: '胶原合成/肌力/益生菌定植均口服独占' },
        ],
      },
    },
    9: {
      completed: false,
      data: {
        cost: {
          ingredients_daily_cost: 12.5,
          processing_per_unit: 0.20,
          packaging_per_box: 8,
          total_per_box: 195,
          suggested_retail: 'HKD 498',
          margin: '62%',
        },
        sop: {
          steps: ['S1 D-甘露糖(大料基底)', 'S2 VC+角豆', 'S3 盆力得+蔓越莓+HA(预混)', 'S4 益生菌(低温轻混)', 'S5 硬脂酸镁(2min)'],
          dosage_form: '粉剂(含颗粒) ~3.2g/条, 1-3条/日',
          packaging: '30条/盒 · 铝箔独立包装 · 充氮密封',
        },
        safety: {
          overall_grade: '✅',
          all_safe: true,
          mandatory_labels: ['随餐服用', '孕妇/哺乳期建议咨询医生'],
        },
      },
    },
    10: {
      completed: false,
      data: {
        chapters: [
          { num: '封面', title: 'FV-PELVIC-001 · 女性盆底生态营养配方', status: 'generated' },
          { num: '01', title: '一页纸决策摘要', status: 'generated' },
          { num: '02', title: '市场机会：盆底健康品类空白', status: 'generated' },
          { num: '03', title: '品类洞察：为什么凯格尔不够', status: 'generated' },
          { num: '04', title: '目标用户与消费场景', status: 'generated' },
          { num: '05', title: '系统解法：四维盆底生态通路', status: 'generated' },
          { num: '06', title: '核心配方与差异化壁垒', status: 'generated' },
          { num: '07', title: '临床验证与功效交付', status: 'generated' },
          { num: '08', title: '营销符号体系', status: 'generated' },
          { num: '09', title: '商业化路径', status: 'generated' },
          { num: '10', title: '合规与风险', status: 'generated' },
          { num: '11', title: '功效交付承诺', status: 'generated' },
        ],
      },
    },
  },
};

export function createNewProject(name: string, code: string): Project {
  return {
    id: `proj-${Date.now()}`,
    code,
    name,
    status: 'stage_1_demand',
    currentStage: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stages: {
      1: { completed: false, data: {} },
      2: { completed: false, data: {} },
      3: { completed: false, data: {} },
      4: { completed: false, data: {} },
      5: { completed: false, data: {} },
      6: { completed: false, data: {} },
      7: { completed: false, data: {} },
      8: { completed: false, data: {} },
      9: { completed: false, data: {} },
      10: { completed: false, data: {} },
    },
  };
}

import { trades } from './trades';

export interface TaskTemplate {
  id: string;
  label: string;
  trade?: string;
  tradeColor?: string;
  description?: string;
  duration?: number;
  dependencies?: string[];
  phase?: number;
  parallel?: number;
  isMilestone?: boolean;
  subtasks?: Array<{
    id: string;
    label: string;
    completed: boolean;
  }>;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tasks: TaskTemplate[];
}

const findTrade = (tradeName: string) => trades.find(t => t.name === tradeName);

export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: 'new-home-construction',
    name: 'New Home Construction',
    description: 'Complete residential construction sequence with parallel workflows',
    category: 'Residential',
    tasks: [
      // Phase 0: Project Start
      {
        id: 'project-start',
        label: 'Project Start',
        description: 'Official project kickoff',
        phase: 0,
        parallel: 0,
        isMilestone: true,
        duration: 0
      },

      // Phase 1: Pre-Construction (parallel tasks)
      {
        id: 'site-survey',
        label: 'Site Survey',
        trade: 'Excavation',
        tradeColor: findTrade('Excavation')?.color,
        description: 'Complete site survey and analysis',
        phase: 1,
        parallel: 0,
        dependencies: ['project-start'],
        duration: 3,
        subtasks: [
          { id: 'ss-1', label: 'Property boundary survey', completed: false },
          { id: 'ss-2', label: 'Topographic mapping', completed: false },
          { id: 'ss-3', label: 'Utility location marking', completed: false }
        ]
      },
      {
        id: 'soil-testing',
        label: 'Soil Testing',
        trade: 'Excavation',
        tradeColor: findTrade('Excavation')?.color,
        description: 'Analyze soil conditions',
        phase: 1,
        parallel: 1,
        dependencies: ['project-start'],
        duration: 2,
        subtasks: [
          { id: 'st-1', label: 'Collect soil samples', completed: false },
          { id: 'st-2', label: 'Laboratory testing', completed: false },
          { id: 'st-3', label: 'Soil report preparation', completed: false }
        ]
      },
      {
        id: 'permits',
        label: 'Building Permits',
        description: 'Obtain necessary permits',
        phase: 1,
        parallel: 2,
        dependencies: ['project-start'],
        duration: 15,
        subtasks: [
          { id: 'bp-1', label: 'Submit permit applications', completed: false },
          { id: 'bp-2', label: 'Pay permit fees', completed: false },
          { id: 'bp-3', label: 'Obtain approvals', completed: false }
        ]
      },

      // Phase 2: Site Preparation Milestone
      {
        id: 'site-prep-ready',
        label: 'Site Preparation Ready',
        description: 'All pre-construction tasks completed',
        phase: 2,
        parallel: 0,
        isMilestone: true,
        dependencies: ['site-survey', 'soil-testing', 'permits'],
        duration: 0
      },

      // Phase 3: Site Work (sequential but some parallel tasks)
      {
        id: 'clear-site',
        label: 'Clear Site',
        trade: 'Excavation',
        tradeColor: findTrade('Excavation')?.color,
        description: 'Clear vegetation and grade site',
        phase: 3,
        parallel: 0,
        dependencies: ['site-prep-ready'],
        duration: 4,
        subtasks: [
          { id: 'cs-1', label: 'Remove vegetation', completed: false },
          { id: 'cs-2', label: 'Initial grading', completed: false },
          { id: 'cs-3', label: 'Install erosion control', completed: false }
        ]
      },
      {
        id: 'rough-grading',
        label: 'Rough Grading',
        trade: 'Excavation',
        tradeColor: findTrade('Excavation')?.color,
        description: 'Grade site to proper elevations',
        phase: 3,
        parallel: 1,
        dependencies: ['clear-site'],
        duration: 3,
        subtasks: [
          { id: 'rg-1', label: 'Cut and fill operations', completed: false },
          { id: 'rg-2', label: 'Establish drainage slopes', completed: false },
          { id: 'rg-3', label: 'Compact soil', completed: false }
        ]
      },

      // Phase 4: Foundation Work (sequential)
      {
        id: 'foundation-start',
        label: 'Foundation Ready',
        description: 'Site prepared for foundation work',
        phase: 4,
        parallel: 0,
        isMilestone: true,
        dependencies: ['rough-grading'],
        duration: 0
      },
      {
        id: 'excavate-foundation',
        label: 'Excavate Foundation',
        trade: 'Excavation',
        tradeColor: findTrade('Excavation')?.color,
        description: 'Dig foundation footings',
        phase: 4,
        parallel: 1,
        dependencies: ['foundation-start'],
        duration: 3,
        subtasks: [
          { id: 'ef-1', label: 'Mark foundation layout', completed: false },
          { id: 'ef-2', label: 'Excavate footings', completed: false },
          { id: 'ef-3', label: 'Install forms', completed: false }
        ]
      },

      // Phase 5: Utilities and Foundation (parallel work)
      {
        id: 'rough-plumbing',
        label: 'Underground Plumbing',
        trade: 'Plumbing',
        tradeColor: findTrade('Plumbing')?.color,
        description: 'Install underground plumbing',
        phase: 5,
        parallel: 0,
        dependencies: ['excavate-foundation'],
        duration: 4,
        subtasks: [
          { id: 'up-1', label: 'Install main sewer line', completed: false },
          { id: 'up-2', label: 'Install water lines', completed: false },
          { id: 'up-3', label: 'Pressure testing', completed: false }
        ]
      },
      {
        id: 'foundation-pour',
        label: 'Pour Foundation',
        trade: 'Foundation',
        tradeColor: findTrade('Foundation')?.color,
        description: 'Pour concrete foundation',
        phase: 5,
        parallel: 1,
        dependencies: ['rough-plumbing'],
        duration: 5,
        subtasks: [
          { id: 'fp-1', label: 'Install rebar', completed: false },
          { id: 'fp-2', label: 'Pour concrete', completed: false },
          { id: 'fp-3', label: 'Cure concrete', completed: false }
        ]
      },

      // Phase 6: Foundation Complete Milestone
      {
        id: 'foundation-complete',
        label: 'Foundation Complete',
        description: 'Foundation work finished',
        phase: 6,
        parallel: 0,
        isMilestone: true,
        dependencies: ['foundation-pour'],
        duration: 0
      },

      // Phase 7: Framing (parallel work possible)
      {
        id: 'first-floor-framing',
        label: 'First Floor Framing',
        trade: 'Framing',
        tradeColor: findTrade('Framing')?.color,
        description: 'Frame first floor walls',
        phase: 7,
        parallel: 0,
        dependencies: ['foundation-complete'],
        duration: 8,
        subtasks: [
          { id: 'ff-1', label: 'Install sill plates', completed: false },
          { id: 'ff-2', label: 'Frame walls', completed: false },
          { id: 'ff-3', label: 'Install floor joists', completed: false }
        ]
      },
      {
        id: 'second-floor-framing',
        label: 'Second Floor Framing',
        trade: 'Framing',
        tradeColor: findTrade('Framing')?.color,
        description: 'Frame second floor',
        phase: 7,
        parallel: 1,
        dependencies: ['first-floor-framing'],
        duration: 8,
        subtasks: [
          { id: 'sf-1', label: 'Frame walls', completed: false },
          { id: 'sf-2', label: 'Install ceiling joists', completed: false },
          { id: 'sf-3', label: 'Install subflooring', completed: false }
        ]
      },
      {
        id: 'roof-framing',
        label: 'Roof Framing',
        trade: 'Framing',
        tradeColor: findTrade('Framing')?.color,
        description: 'Frame roof structure',
        phase: 7,
        parallel: 2,
        dependencies: ['second-floor-framing'],
        duration: 6,
        subtasks: [
          { id: 'rf-1', label: 'Install trusses', completed: false },
          { id: 'rf-2', label: 'Install sheathing', completed: false },
          { id: 'rf-3', label: 'Install underlayment', completed: false }
        ]
      },

      // Phase 8: Framing Complete Milestone
      {
        id: 'framing-complete',
        label: 'Framing Complete',
        description: 'All framing work completed',
        phase: 8,
        parallel: 0,
        isMilestone: true,
        dependencies: ['roof-framing'],
        duration: 0
      },

      // Phase 9: MEP Rough-ins (parallel work)
      {
        id: 'electrical-rough',
        label: 'Electrical Rough-in',
        trade: 'Electrical',
        tradeColor: findTrade('Electrical')?.color,
        description: 'Install electrical rough-in',
        phase: 9,
        parallel: 0,
        dependencies: ['framing-complete'],
        duration: 7,
        subtasks: [
          { id: 'er-1', label: 'Install main panel', completed: false },
          { id: 'er-2', label: 'Run circuit wiring', completed: false },
          { id: 'er-3', label: 'Install boxes', completed: false }
        ]
      },
      {
        id: 'plumbing-rough',
        label: 'Plumbing Rough-in',
        trade: 'Plumbing',
        tradeColor: findTrade('Plumbing')?.color,
        description: 'Install plumbing rough-in',
        phase: 9,
        parallel: 1,
        dependencies: ['framing-complete'],
        duration: 7,
        subtasks: [
          { id: 'pr-1', label: 'Install supply lines', completed: false },
          { id: 'pr-2', label: 'Install drain lines', completed: false },
          { id: 'pr-3', label: 'Install vent stacks', completed: false }
        ]
      },
      {
        id: 'hvac-rough',
        label: 'HVAC Rough-in',
        trade: 'HVAC',
        tradeColor: findTrade('HVAC')?.color,
        description: 'Install HVAC rough-in',
        phase: 9,
        parallel: 2,
        dependencies: ['framing-complete'],
        duration: 7,
        subtasks: [
          { id: 'hr-1', label: 'Install ductwork', completed: false },
          { id: 'hr-2', label: 'Set HVAC units', completed: false },
          { id: 'hr-3', label: 'Install vents', completed: false }
        ]
      },

      // Phase 10: MEP Rough-ins Complete
      {
        id: 'mep-complete',
        label: 'MEP Rough-ins Complete',
        description: 'All MEP rough-ins completed',
        phase: 10,
        parallel: 0,
        isMilestone: true,
        dependencies: ['electrical-rough', 'plumbing-rough', 'hvac-rough'],
        duration: 0
      },

      // Phase 11: Insulation and Drywall
      {
        id: 'insulation',
        label: 'Insulation',
        trade: 'Drywall',
        tradeColor: findTrade('Drywall')?.color,
        description: 'Install insulation',
        phase: 11,
        parallel: 0,
        dependencies: ['mep-complete'],
        duration: 4,
        subtasks: [
          { id: 'in-1', label: 'Install wall insulation', completed: false },
          { id: 'in-2', label: 'Install ceiling insulation', completed: false },
          { id: 'in-3', label: 'Install vapor barriers', completed: false }
        ]
      },
      {
        id: 'drywall',
        label: 'Drywall',
        trade: 'Drywall',
        tradeColor: findTrade('Drywall')?.color,
        description: 'Install and finish drywall',
        phase: 11,
        parallel: 1,
        dependencies: ['insulation'],
        duration: 10,
        subtasks: [
          { id: 'dw-1', label: 'Hang drywall', completed: false },
          { id: 'dw-2', label: 'Tape and mud', completed: false },
          { id: 'dw-3', label: 'Sand and finish', completed: false }
        ]
      },

      // Phase 12: Interior Finishes (parallel work)
      {
        id: 'paint',
        label: 'Painting',
        trade: 'Painting',
        tradeColor: findTrade('Painting')?.color,
        description: 'Paint interior',
        phase: 12,
        parallel: 0,
        dependencies: ['drywall'],
        duration: 8,
        subtasks: [
          { id: 'pt-1', label: 'Prime walls', completed: false },
          { id: 'pt-2', label: 'Paint walls', completed: false },
          { id: 'pt-3', label: 'Paint trim', completed: false }
        ]
      },
      {
        id: 'flooring',
        label: 'Flooring',
        trade: 'Flooring',
        tradeColor: findTrade('Flooring')?.color,
        description: 'Install flooring',
        phase: 12,
        parallel: 1,
        dependencies: ['drywall'],
        duration: 7,
        subtasks: [
          { id: 'fl-1', label: 'Install hardwood', completed: false },
          { id: 'fl-2', label: 'Install tile', completed: false },
          { id: 'fl-3', label: 'Install carpet', completed: false }
        ]
      },
      {
        id: 'cabinets',
        label: 'Cabinets',
        trade: 'Millwork',
        tradeColor: findTrade('Millwork')?.color,
        description: 'Install cabinets',
        phase: 12,
        parallel: 2,
        dependencies: ['drywall'],
        duration: 5,
        subtasks: [
          { id: 'cb-1', label: 'Install base cabinets', completed: false },
          { id: 'cb-2', label: 'Install wall cabinets', completed: false },
          { id: 'cb-3', label: 'Install hardware', completed: false }
        ]
      },

      // Phase 13: Interior Complete
      {
        id: 'interior-complete',
        label: 'Interior Complete',
        description: 'All interior work completed',
        phase: 13,
        parallel: 0,
        isMilestone: true,
        dependencies: ['paint', 'flooring', 'cabinets'],
        duration: 0
      },

      // Phase 14: Final Inspections
      {
        id: 'final-inspection',
        label: 'Final Inspection',
        description: 'Final building inspection',
        phase: 14,
        parallel: 0,
        dependencies: ['interior-complete'],
        duration: 2,
        subtasks: [
          { id: 'fi-1', label: 'Building inspection', completed: false },
          { id: 'fi-2', label: 'Electrical inspection', completed: false },
          { id: 'fi-3', label: 'Plumbing inspection', completed: false },
          { id: 'fi-4', label: 'HVAC inspection', completed: false }
        ]
      },

      // Phase 15: Project Complete
      {
        id: 'project-complete',
        label: 'Project Complete',
        description: 'Construction completed',
        phase: 15,
        parallel: 0,
        isMilestone: true,
        dependencies: ['final-inspection'],
        duration: 0
      }
    ]
  }
];
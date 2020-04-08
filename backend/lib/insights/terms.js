'use strict';

const categories = [
    'homicide',
    'manslaughter',
    'assault',
    'arms',
    'battery',
    'threat',
    'theft',
    'carjacking',
    'robbery',
    'arson',
    'burglary',
    'forgery',
    'fraud',
    'impersonation',
    'embezzlement',
    'stolen-property',
    'vandalism',
    'drugs',
    'indecent',
    'disturbance',
    'prostitution',
    'minor',
    'child-custody',
    'disobedience',
    'traffic-accident',
    'hit-run',
    'dui',
    'traffic-offense',
    'health-safety',
    'trespass',
    'lewd-conduct',
    'public-offense',
    'parole',
    'probation'
];


/**
 * https://flatuicolors.com/palette/us
 */
const categoryOptions = {
    'homicide': {
        color: '#ff3f34',
        icon: 'cemetery',
    },
    'manslaughter': {
        color: '#ff5e57',
        icon: 'hospital',
    },
    'assault': {
        color: '#f53b57',
        icon: 'golf',
    },
    'arms': {
        color: '#ef5777',
        icon: 'doctor',
    },
    'battery': {
        color: '#ffa801',
        icon: 'dentist',
    },
    'threat': {
        color: '#ffc048',
        icon: 'volcano',
    },
    'theft': {
        color: '#0fbcf9',
        icon: 'alcohol-shop',
    },
    'carjacking': {
        color: '#4bcffa',
        icon: 'car',
    },
    'robbery': {
        color: '#00d8d6',
        icon: 'entrance',
    },
    'trespass': {
        color: '#00a8ff',
        icon: 'museum',
    },
    'arson': {
        color: '#ffdd59',
        icon: 'fire-station',
    },
    'burglary': {
        color: '#3c40c6',
        icon: 'prison',
    },
    'forgery': {
        color: '#575fcf',
        icon: 'circle',
    },
    'fraud': {
        color: '#00d8d6',
        icon: 'bank',
    },
    'impersonation': {
        color: '#34e7e4',
        icon: 'information',
    },
    'embezzlement': {
        color: '#18dcff',
        icon: 'ice-cream',
    },
    'stolen-property': {
        color: '#17c0eb',
        icon: 'fast-food',
    },
    'vandalism': {
        color: '#ffaf40',
        icon: 'fuel',
    },
    'drugs': {
        color: '#BDC581',
        icon: 'music',
    },
    'indecent': {
        color: '#F8EFBA',
        icon: 'rail-metro',
    },
    'disturbance': {
        color: '#EAB543',
        icon: 'rocket',
    },
    'prostitution': {
        color: '#3B3B98',
        icon: 'volcano',
    },
    'minor': {
        color: '#1B9CFC',
        icon: 'zoo',
    },
    'child-custody': {
        color: '#1B9CFC',
        icon: 'school',
    },
    'disobedience': {
        color: '#fbc531',
        icon: 'playground',
    },
    'traffic-accident': {
        color: '#FEA47F',
        icon: 'marker',
    },
    'hit-run': {
        color: '#F97F51',
        icon: 'heliport',
    },
    'dui': {
        color: '#8c7ae6',
        icon: 'bar',
    },
    'traffic-offense': {
        color: '#9c88ff',
        icon: 'ferry',
    },
    'health-safety': {
        color: '#0097e6',
        icon: 'embassy',
    },
    'lewd-conduct': {
        color: '#fdcb6e',
        icon: 'mountain',
    },
    'public-offense': {
        color: '#ffeaa7',
        icon: '',
    },
    'parole': {
        color: '#e17055',
        icon: 'star',
    },
    'probation': {
        color: '#e17055',
        icon: 'stadium',
    },
    'other': {
        color: '#636e72',
        icon: 'toilet',
    }
};
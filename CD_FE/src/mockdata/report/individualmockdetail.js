const commonDetailCategories = [
  {
    id: 'camera',
    name: '카메라 응시',
    items: [
      {
        label: '카메라 응시율',
        description:
          'AI와의 대면에서 직접 눈맞춤을 유지하는 정도를 측정합니다.',
        detail:
          '지정된 시간 동안 카메라를 바라본 비율입니다. 면접관과의 신뢰 관계 형성에 중요합니다.',
      },
      {
        label: '발화 속도',
        description:
          '분당 단어 수(Speech Per Minute)로 측정한 발화 속도입니다.',
        detail: '너무 빠르거나 느리면 청취자가 내용을 이해하기 어렵습니다.',
      },
      {
        label: '음성 크기',
        description: '음성의 크기를 데시벨로 측정합니다.',
        detail:
          '명확한 음성 크기는 신뢰성을 높입니다. 너무 크거나 작으면 전달력이 떨어질 수 있습니다.',
      },
      {
        label: '침묵 구간',
        description: '답변 중 일정 시간 이상 말이 멈춘 횟수입니다.',
        detail:
          '침묵이 너무 많으면 답변 준비가 부족하거나 자신감이 낮아 보일 수 있습니다.',
      },
      {
        label: '필러 사용',
        description: '"음", "어", "그" 같은 필러의 사용 횟수입니다.',
        detail:
          '필러가 많으면 답변이 부자연스럽고 준비가 부족해 보일 수 있습니다.',
      },
      {
        label: '미소율',
        description: '면접 중 미소를 짓는 비율입니다.',
        detail:
          '자연스러운 미소는 긍정적인 인상을 주지만 과도하면 진지함이 부족해 보일 수 있습니다.',
      },
      {
        label: '눈 깜빡임',
        description: '면접 중 눈을 깜빡인 빈도입니다.',
        detail: '과도한 눈 깜빡임은 긴장이나 불안감을 나타낼 수 있습니다.',
      },
      {
        label: '문장 끝 흐릿함',
        description: '문장의 끝이 흐릿하게 끝나는 비율입니다.',
        detail:
          '문장의 끝을 명확하게 마무리하면 답변이 더 자신감 있게 들립니다.',
      },
      {
        label: '고개 끄덕임',
        description: '면접 중 고개 끄덕임의 비율입니다.',
        detail: '적절한 고개 끄덕임은 경청 태도와 반응성을 보여줄 수 있습니다.',
      },
      {
        label: '어깨 기울기',
        description: '어깨가 안정적으로 유지되는 정도입니다.',
        detail:
          '어깨가 한쪽으로 기울어지지 않고 안정적이면 신뢰감 있는 자세로 보입니다.',
      },
      {
        label: '몸 흔들림',
        description: '면접 중 몸이 흔들린 횟수입니다.',
        detail: '불필요한 몸 흔들림은 긴장감이나 산만함으로 보일 수 있습니다.',
      },
    ],
  },
];

export const individualReportsDetail = [
  {
    id: 1,
    categories: commonDetailCategories,
  },
  {
    id: 2,
    categories: commonDetailCategories,
  },
  {
    id: 3,
    categories: commonDetailCategories,
  },
];

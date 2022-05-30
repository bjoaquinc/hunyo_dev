

export default function () {
  return {
    post: {
      topics: [],
      title: '',
      isQuestion: false,
      content: '',
    },
    uploadedImagesList: [],
    bestPracticesList: [
      {topic: 'Details', isMinimized: true, practicesList: [
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. ',
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. ',
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. ',
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. ',
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. ',
      ]},
      {topic: 'Materials', isMinimized: true, practicesList: [
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. ',
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. ',
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. ',
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. ',
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. ',
      ]},
      {topic: 'Methods', isMinimized: true, practicesList: [
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. ',
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. ',
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. ',
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. ',
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. ',
      ]},
      {topic: 'Design Approaches', isMinimized: true, practicesList: [
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. ',
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. ',
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. ',
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. ',
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. ',
      ]}
    ],
    chosenBestPracticesList: [],
    postItem: null,
    unsubscribePostItem: null,
    drafts: [],
    unsubscribeDrafts: null,
  }
}

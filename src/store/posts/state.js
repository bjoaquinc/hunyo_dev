export default function () {
  return {
    post: {
      topics: [],
      title: '',
      withFeedback: false,
      isQuestion: false,
      content: '',
      convertedImagesList: []
    },
    uploadedImagesList: [],
    croppedImagesList: [],
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
    hasDrafts: true,
    previousRouteName: ''
  }
}

// Prototype imagery: free-licence stock photos and videos from Pexels
// (pexels.com/license, free for commercial use, no attribution needed).
// Placeholders until Specsmakers campaign assets replace them.

export const pexelsPhoto = (id: number, width = 1080) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;

const pexelsVideo = (id: number, file: string) => `https://videos.pexels.com/video-files/${id}/${file}`;

export const PHOTOS = {
  womanMotorbikeDelhi: pexelsPhoto(17118914),
  manSunglassesStreet: pexelsPhoto(7102553),
  womanSareeReading: pexelsPhoto(17612005),
  womanSareePortrait: pexelsPhoto(17450829),
  grandmotherSmiling: pexelsPhoto(15759710),
  tortoiseFrameNight: pexelsPhoto(20903179),
  orangeJacketGlasses: pexelsPhoto(31293597),
  floralRoundGlasses: pexelsPhoto(27523299),
  blackFrameGirl: pexelsPhoto(11651941),
  couplePastel: pexelsPhoto(30040353),
  girlBlueGlasses: pexelsPhoto(8535627),
  boyGlasses: pexelsPhoto(7417171),
  framesFlatLay: pexelsPhoto(27162214),
  framesShowcase: pexelsPhoto(26050120),
  framesYellow: pexelsPhoto(28834289),
  sunglassesPool: pexelsPhoto(26050118),
  thinMetalFrame: pexelsPhoto(3042732),
  blueLightFrame: pexelsPhoto(4037163),
  acetateCorner: pexelsPhoto(6011443),
  sunglassesSea: pexelsPhoto(343720),
  sunglassesSandSun: pexelsPhoto(38890701),
  toddlerPlayground: pexelsPhoto(8909481),
  boyUkulele: pexelsPhoto(9302738),
} as const;

// 720p renditions keep each clip around 1.3–2.4 MB for smooth mobile playback.
export const VIDEOS = {
  womanPutsOnGlasses: pexelsVideo(6998555, '6998555-hd_720_1280_25fps.mp4'),
  prescriptionGlassesCloseUp: pexelsVideo(5995502, '5995502-hd_1280_720_30fps.mp4'),
  eyeglassesCloseUp: pexelsVideo(5995403, '5995403-hd_1280_720_30fps.mp4'),
  happySunglasses: pexelsVideo(9872447, '9872447-hd_1280_720_24fps.mp4'),
} as const;

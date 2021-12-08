export const CONFIG = {
  sphereDetail: 2,
  radius: 15,
  turns: 1,
  count: 80,
  speed: 0,
  axialSpeed: -0.5,
  section: { width: 3, height: 3, countPerSide: 4 },
  size: { default: 1, min: 1, max: 1 },
  hollow: false,

  //row = le numéro de la 'section'
  //uid = l'identifiant unique d'une bille
  //retourne: array.push(R, G, B);
  color: true,
  colorRule: (row, uid, array) => {
    let grey = 0.85;
    if (uid % 4 == 0) {
      array.push(0, 0, 0);
    } else {
      //ajoute une bille rouge de temps à autres
      if (Math.random() > 0.99) {
        array.push(1, 0, 0);
      } else {
        array.push(grey, grey, grey);
      }
    }
  },

  //material
  roughness: 0.65,
  metalness: 0.35,
  envMapIntensity: 0.35,
};

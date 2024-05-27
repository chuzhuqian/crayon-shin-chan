export class MinMaxGUIHelper {

  constructor( obj, minProp, maxProp, minDif ) {

    this.obj = obj;
    this.minProp = minProp;
    this.maxProp = maxProp;
    this.minDif = minDif;

  }
  get min() {

    return this.obj[ this.minProp ];

  }
  set min( v ) {

    this.obj[ this.minProp ] = v;
    this.obj[ this.maxProp ] = Math.max( this.obj[ this.maxProp ], v + this.minDif );

  }
  get max() {

    return this.obj[ this.maxProp ];

  }
  set max( v ) {

    this.obj[ this.maxProp ] = v;
    this.min = this.min; // this will call the min setter

  }

}

export function resizeRendererToDisplaySize( renderer ) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if ( needResize ) {
    renderer.setSize( width, height, false );
  }

  return needResize;
}
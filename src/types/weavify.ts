export interface WeavifyElement {
  id: string;
  type: 'section' | 'container' | 'text' | 'button' | 'image' | 'input' | 'grid' | 'flex' | 
        'columns' | 'header' | 'footer' | 'sidebar' | 'card' | 'modal' | 'heading' | 'video' | 
        'link' | 'list' | 'table' | 'textarea' | 'select' | 'checkbox' | 'radio' | 
        'navbar' | 'menu' | 'breadcrumb' | 'paragraph' | 'code' | 'quote' | 'audio' | 'icon' |
        'gallery' | 'carousel' | 'form' | 'slider' | 'toggle' | 'accordion' | 'tabs' | 
        'tooltip' | 'toast' | 'badge' | 'progress' | 'spinner' | 'avatar' | 'divider' |
        'chart' | 'map' | 'calendar' | 'datepicker' | 'search' | 'pagination' | 'iframe' |
        'embed' | 'canvas' | 'svg' | 'productcard' | 'pricetable' | 'testimonial' | 'countdown' |
        'chatwidget' | 'socialmedia' | 'newsletter' | 'loginform' | 'signupform' | 'contactform' |
        'faq' | 'stats' | 'timeline' | 'pricing' | 'team' | 'blogpost' | 'portfolio' | 'hero' | 'tag';
  name: string;
  locked?: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  children?: WeavifyElement[];
  styles: {
    backgroundColor?: string;
    color?: string;
    fontSize?: number;
    fontWeight?: string;
    fontFamily?: string;
    lineHeight?: number;
    letterSpacing?: number;
    textAlign?: string;
    textDecoration?: string;
    textTransform?: string;
    padding?: number;
    paddingTop?: number;
    paddingRight?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    margin?: number;
    marginTop?: number;
    marginRight?: number;
    marginBottom?: number;
    marginLeft?: number;
    borderRadius?: number;
    border?: string;
    borderWidth?: number;
    borderStyle?: string;
    borderColor?: string;
    display?: string;
    flexDirection?: 'row' | 'column';
    justifyContent?: string;
    alignItems?: string;
    flexWrap?: string;
    gridTemplateColumns?: string;
    gridTemplateRows?: string;
    gap?: number;
    opacity?: number;
    transform?: string;
    transformOrigin?: string;
    rotate?: number;
    rotateX?: number;
    rotateY?: number;
    scale?: number;
    translateX?: number;
    translateY?: number;
    perspective?: number;
    transition?: string;
    boxShadow?: string;
    textShadow?: string;
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    backgroundRepeat?: string;
    backdropFilter?: string;
    filter?: string;
    zIndex?: number;
    position?: string;
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
    width?: string;
    height?: string;
    minWidth?: string;
    maxWidth?: string;
    minHeight?: string;
    maxHeight?: string;
    overflow?: string;
    cursor?: string;
    pointerEvents?: string;
    mixBlendMode?: string;
    clipPath?: string;
  };
  content?: string;
  props?: Record<string, any>;
  animations?: Animation[];
  interactions?: Interaction[];
}

export interface Animation {
  id: string;
  property: string;
  from: any;
  to: any;
  duration: number;
  easing: string;
  trigger: 'load' | 'hover' | 'click' | 'scroll';
}

export interface Interaction {
  id: string;
  trigger: 'click' | 'hover' | 'scroll' | 'input';
  action: 'navigate' | 'toggle' | 'animate' | 'api';
  target?: string;
  value?: any;
}

export interface WeavifyProject {
  id: string;
  name: string;
  pages: WeavifyPage[];
  globalStyles: Record<string, any>;
  framework: 'react' | 'vue' | 'svelte' | 'html';
}

export interface WeavifyPage {
  id: string;
  name: string;
  path: string;
  elements: WeavifyElement[];
}

export type Tool = 'select' | 'drag' | 'text' | 'draw' | 'section' | 'button';
export type ViewMode = 'desktop' | 'tablet' | 'mobile';

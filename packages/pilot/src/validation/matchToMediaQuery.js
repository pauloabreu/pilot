export const matchToPrint = () => window.matchMedia('print').matches

export const matchToTv = () => window.matchMedia('screen and (width >= 1920px)').matches

export const matchToDesk = () => window.matchMedia('screen and (width > 1024px) and (width < 1920px)').matches

export const matchToTablet = () => window.matchMedia('screen and (width > 640px) and (width <= 1024px)').matches

export const matchToPalm = () => window.matchMedia('screen and (width <= 640px)').matches

const match = mediaQuery => window.matchMedia(mediaQuery).matches

export default match

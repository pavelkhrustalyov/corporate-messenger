export interface IAvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    size: 'small' | 'middle' | 'large';
    isOnline?: boolean;
}


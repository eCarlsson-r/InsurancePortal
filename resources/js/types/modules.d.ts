declare module '@svg-maps/usa';
declare module 'react-slick';
declare module 'react-circular-progressbar';

// jQuery declarations for Bootstrap modals
declare global {
    interface JQueryStatic {
        (selector: string | Element): JQuery;
        fn: {
            modal: (action?: string) => void;
        };
    }

    interface JQuery {
        modal: (action?: string) => void;
    }

    interface Window {
        $?: JQueryStatic;
        jQuery?: JQueryStatic;
    }
}

export {};

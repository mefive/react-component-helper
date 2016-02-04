import React, {PropTypes} from 'react';
import ReactDOM, {
    unstable_renderSubtreeIntoContainer as renderSubtreeIntoContainer,
    unmountComponentAtNode,
    findDOMNode
} from 'react-dom';

const Trigger = React.createClass({
    getDefaultProps() {
        return {
            popupMountInside: true,
            activeClass: 'active',
            actions: '',
            onShow: () => {},
            onHide: () => {}
        };
    },

    getInitialState() {
        return {
            aboutToLeave: false,
            visible: false
        };
    },

    componentWillReceiveProps(nextProps) {
        if (nextProps.visible != null) {
            this.state.visible = nextProps.visible;  
        }
    },

    componentDidMount() {
        this.componentDidUpdate();
    },

    componentWillUnmount() {
        const {popupMountInside, getPopupContainer} = this.props;
        const popupContainer = this.popupContainer;

        if (!popupMountInside) {
            unmountComponentAtNode(popupContainer);
            if (!getPopupContainer) {
                document.body.removeChild(popupContainer);
            }
            else {
                // [TODO] unmount hanlder
            }
        }
    },

    componentDidUpdate(prevProps, prevState) {
        let {popup, activeClass, getPopupContainer} = this.props;

        const {visible} = this.state;

        if (!getPopupContainer) {
            getPopupContainer = this.getPopupContainer;
        }

        let popupProps = {};

        if (this.popupRendered) {
            if (visible) {
                popupProps
                = {
                    className: (popup.props.className + ' ' + activeClass),
                    visible
                };
            }

            popup = React.cloneElement(popup, popupProps);

            renderSubtreeIntoContainer(
                this,
                popup,
                getPopupContainer()
            );
        } 
    },

    getPopupContainer() {
        const {popupMountInside, popupStyle} = this.props;
        let {popupContainer} = this;

        if (popupContainer) {
            return popupContainer;
        }

        popupContainer
        = this.popupContainer 
        = document.createElement('div');

        if (popupMountInside) {
            findDOMNode(this).appendChild(popupContainer);
        }
        else {
            document.body.appendChild(popupContainer);
        }

        return popupContainer;
    },

    onClick() {
        const {visible} = this.state;

        if (visible) {
            this.hide();
        }
        else {
            this.show();
        }
    },

    onMouseEnter() {
        const {aboutToLeave} = this.state;

        if (aboutToLeave) {
            this.state.aboutToLeave = false;
        }
        else {
            this.show();
        }
    },

    onMouseLeave() {
        const {delay} = this.props;
        const {state} = this;

        if (!delay) {
            this.hide();
        }
        else {
            setTimeout(
                () => {
                    if (state.aboutToLeave) {
                        this.hide();
                    }
                },
                delay
            );

            state.aboutToLeave = true;
        }
    },

    onFocus() {
        this.show();
    },

    onBlur() {
        this.hide();
    },

    show() {
        this.setState({
            visible: true
        });
        this.props.onShow();
    },

    hide() {
        this.setState({
            visible: false,
            aboutToLeave: false
        });
        this.props.onHide();
    },

    render() {
        const {children, actions, popupMountInside} = this.props;
        const {visible} = this.state;

        this.popupRendered = this.popupRendered || visible;

        let triggerProps = {};

        if (actions.indexOf('click') !== -1) {
            triggerProps.onClick = this.onClick;
        }

        if (actions.indexOf('hover') !== -1) {
            triggerProps.onMouseEnter = this.onMouseEnter;
            triggerProps.onMouseLeave = this.onMouseLeave;
        }

        if (actions.indexOf('focus') !== -1) {
            triggerProps.onFocus = this.onFocus;
            triggerProps.onBlur = this.onBlur;
        }

        return React.cloneElement(children, triggerProps);
    }
});

Trigger.propTypes = {
    actions: PropTypes.string,
    activeClass: PropTypes.string,
    popup: PropTypes.node,
    popupMountInside: PropTypes.bool,
    getPopupContainer: PropTypes.func,
    visible: PropTypes.bool,
    onShow: PropTypes.func,
    onHide: PropTypes.func
};

export default Trigger;

import { inject, observer } from 'mobx-react';
import React from 'react';
import classnames from 'classnames';
import { TabsStore } from '@stores';
import ReactResizeDetector from 'react-resize-detector';
import Tabs from './Tabs';

interface IInjectedProps {
    tabsStore?: TabsStore
}

@inject('tabsStore')
@observer
export default class TabsContainer extends React.Component<IInjectedProps & { className?: string }> {

    render() {
        const {tabsStore, className: classNameProp} = this.props;
        const activeTabIndex = tabsStore!.activeTabIndex;
        const tabLabels = tabsStore!.tabsInfo;
        const className = classNameProp ? classnames(classNameProp) : undefined;

        return (
            <Tabs
                className={className}
                tabs={tabLabels.map((info, index) => ({
                    info,
                    index,
                    active: index === activeTabIndex,
                    onClose: () => tabsStore!.closeTab(index),
                    onClick: () => tabsStore!.selectTab(index)
                }))}
                activeTabIndex={activeTabIndex}
            />
        );
    }
}

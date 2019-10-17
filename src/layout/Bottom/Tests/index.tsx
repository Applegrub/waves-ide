import React from 'react';
import styles from './styles.less';
import { inject, observer } from 'mobx-react';
import { TestsStore } from '@stores';
import TestExplorer from './TestExplorer';
import StatusBar from './StatusBar';
import Icn from './Icn';
import Scrollbar from '@components/Scrollbar';
import { Line } from '@components/NewRepl/components/Line';

interface IInjectedProps {
    testsStore?: TestsStore
}

interface IProps extends IInjectedProps {}

@inject('testsStore')
@observer
export default class Tests extends React.Component<IProps> {
    render(): React.ReactNode {
        const testsStore = this.props.testsStore!;

        return <div className={styles.root}>
            <div className={styles.tests_toolbar}>
                <Icn type="start" onClick={testsStore.rerunTest.bind(testsStore)} disabled={(testsStore.rerunDisabled)}/>
                <Icn type="stop" onClick={testsStore.stopTest.bind(testsStore)} disabled={!testsStore.running}/>
                <div className={styles.tests_passedTitle}>{testsStore.fileName}</div>
            </div>
            <div className={styles.tests_body}>
                <TestExplorer tree={testsStore.testTree}
                              onSelect={testsStore.selectNode.bind(testsStore)}
                              minSize={150}
                              maxSize={600}
                              storeKey="testExplorer"
                              resizeSide={'right'}
                              disableClose/>
                <div className={styles.tests_replPanel}>
                    <StatusBar running={testsStore.running}
                               passed={testsStore.info.passed}
                               total={testsStore.info.total}/>
                    <Scrollbar>
                        {testsStore.currentMessages.map(({message, type}, i) =>
                            <Line key={i} type="log" error={type === 'error'} value={message}/>
                        )}
                    </Scrollbar>
                </div>
            </div>
        </div>;
    }
}



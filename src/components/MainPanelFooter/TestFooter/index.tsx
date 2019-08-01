import React from 'react';
import classNames from 'classnames';
import { IJSFile } from '@stores';
import RunTestButton from './RunTestButton';
import styles from '../styles.less';

interface IProps {
    className?: string,
    file: IJSFile,
}

class TestFooter extends React.Component<IProps> {
    render() {
        const { className, file } = this.props;

        const rootClassName = classNames(styles!.root, className);

        return (
            <div className={rootClassName}>
                <div className={styles.left}/>
                <div className={styles.right}>
                    <RunTestButton file={file}/>
                </div>
            </div>
        );
    }
}

export default TestFooter;

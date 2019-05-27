import React from 'react';
import NewFileBtn from '../NewFileBtn';
import styles from './styles.less';

class SidePanelFooter extends React.Component {
    render() {
        return (
            <div className={styles.footer}>
                <NewFileBtn position="explorer"/>
            </div>
        );
    }
}

export default SidePanelFooter;
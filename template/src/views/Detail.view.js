import React from 'react';
import { Button } from 'antd';
import { DetailTable, Panel } from 'mcf-components';
import { ViewPage } from 'mcf-crud';

export default class DetailView extends ViewPage {
  componentDidMount() {
    const {
      actions,
      match: { params },
    } = this.props;

    actions.fetchItem({ id: params.id });
  }

  handleCancel(values) {
    this.goBack();
  }

  render() {
    const { item, locale } = this.props;
    const basic = item.basic || {};
    const source = [
      {
        name: locale('serverName.label'),
        value: basic.serverName,
      },
    ];

    return (
      <Panel
        title={locale('GLOBAL.DETAIL')}
        footer={() => (
          <Button
            type="primary"
            onClick={this.handleCancel.bind(this, 'handleCancel')}
          >
            {locale('GLOBAL.BACK')}
          </Button>
        )}
      >
        <DetailTable
          title={locale('baseInfo.title')}
          dataSource={source}
          columnNumber={2}
        />
      </Panel>
    );
  }
}

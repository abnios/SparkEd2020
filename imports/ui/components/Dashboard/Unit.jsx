/* eslint no-shadow: 0, no-plusplus: 0 */
import React, { Component, Fragment } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import M from 'materialize-css';
import { _Units } from '../../../api/units/units';
import * as config from '../../../../config.json';
import { ThemeContext } from '../../containers/AppWrapper'; // eslint-disable-line

export class Unit extends Component {
  constructor() {
    super();
    this.state = {
      topics: [{ name: '' }],
      description: '',
      unitName: '',
    };
  }

  addTopic = () => {
    this.setState({
      topics: this.state.topics.concat([{ name: '' }]),
    });
  };

  removeTopic = index => () => {
    if (index === 0) {
      return false;
    }
    this.setState({
      topics: this.state.topics.filter((s, sidx) => index !== sidx),
    });
  };

  handleTopicChange = index => e => {
    const newTopics = this.state.topics.map((topic, sidx) => {
      if (index !== sidx) return topic;
      return { ...topic, name: e.target.value };
    });

    this.setState({
      topics: newTopics,
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    const courseId = FlowRouter.getParam('_id');
    const language = FlowRouter.getQueryParam('y');
    const unitId = new Meteor.Collection.ObjectID().valueOf();
    let count = 0;
    let details = {};
    const { topics, description, unitName } = this.state;
    details = {
      language,
      courseId,
    };
    // insert topic in collection from here 1 * 1

    const msg = `new Subject named ${unitName} has been added with ${count} units`;
    Meteor.call(
      'unit.insert',
      unitId,
      unitName,
      count,
      description,
      details,
      err => {
        err
          ? M.toast({ html: `<span>${err.reason}</span>`, classes: 'red' })
          : Meteor.call('insert.search', unitId, {}, unitName, 'unit', err => {
            err
              ? M.toast({
                html: `<span>${err.reason}</span>`,
                classes: 'red',
              })
              : Meteor.call(
                'insertNotification',
                msg,
                'unit',
                unitId,
                err => {
                  // eslint-disable-next-line
                      err
                    ? M.toast({
                      html: `<span>${err.reason}</span>`,
                      classes: 'red',
                    })
                    : (this.setState({
                      topics: [{ name: '' }],
                      description: '',
                      unitName: '',
                    }),
                    M.toast({
                      html: `<span>Added ${unitName} successfully and ${count} Unit</span>`,
                    }));
                },
              );
          });
      },
    );
    if (!topics.length) {
      return;
    }
    if (!config.isHighSchool) {
      // eslint-disable-next-line no-restricted-syntax
      for (const topic of topics) {
        // eslint-disable-line
        const { name } = topic;
        const _id = new Meteor.Collection.ObjectID().valueOf();

        Meteor.call(
          'topic.insert',
          _id,
          unitId,
          name,
          unitName,
          // details, this is temporaly removed
          err => {
            err
              ? M.toast({ html: `<span>${err.reason}</span>`, classes: 'red' })
              : Meteor.call(
                'insert.search',
                _id,
                { unitId },
                name,
                'topic',
                err => {
                  // eslint-disable-next-line
                    err
                    ? M.toast({
                      html: `<span>${err.reason}</span>`,
                      classes: 'red',
                    })
                    : '';
                },
              );
          },
        );
        count++;
      }
    }
  };

  getUnitName = ({ target: { value } }) => {
    this.setState({
      unitName: value,
    });
  };
  getDescription = ({ target: { value } }) => {
    this.setState({
      description: value,
    });
  };
  backToUnits = e => {
    e.preventDefault();
    return FlowRouter.go(`/dashboard/units/${FlowRouter.getParam('_id')}`);
  };
  render() {
    const { topics, description, unitName } = this.state;
    const name = Session.get('sub_unit_title');
    return (
      <ThemeContext.Consumer>
        {({ state }) => (
          <Fragment>
            <div className="m1" />
            <div
              className="col m9 s11 "
              style={{
                color: state.isDark ? '#F5FAF8' : '#000000',
              }}
            >
              <div className="card ">
                <div
                  className={`card-panel ${state.isDark && 'grey darken-4'}`}
                >
                  <div className="">
                    <button
                      className="btn fa fa-arrow-left"
                      onClick={this.backToUnits}
                    >
                      {` ${name}`}
                    </button>
                    <h5 className="center large">{`Add New ${name}`}</h5>
                  </div>

                  <form
                    className="new-topic"
                    name="new-topic"
                    onSubmit={e => this.handleSubmit(e)}
                  >
                    <div className="input-field">
                      <input
                        type="text"
                        name="topic[]"
                        className="unit clear"
                        placeholder={`Add ${name}`}
                        value={unitName}
                        onChange={e => this.getUnitName(e)}
                        required
                      />
                    </div>

                    <div className="input-field">
                      <textarea
                        name="descr"
                        className="unitdesc clear materialize-textarea"
                        placeholder={`Add ${name} Description`}
                        value={description}
                        onChange={e => this.getDescription(e)}
                        required
                      />
                    </div>
                    {config.isHighSchool ? (
                      <span />
                    ) : (
                      topics.map((topic, index) => (
                        <div className="topic " key={index}>
                          <input
                            type="text"
                            id={index}
                            placeholder={'Add Units'}
                            value={topic.name}
                            onChange={this.handleTopicChange(index)}
                            className={`${index}`}
                            name="topic"
                          />
                        </div>
                      ))
                    )}

                    {config.isHighSchool ? (
                      <div className="row">
                        <span className="input-group-btn">
                          <button
                            className="btn fa fa-floppy-o pull-right s12"
                            role="submit"
                          >
                            {' '}
                            Save{' '}
                          </button>
                        </span>
                      </div>
                    ) : (
                      <div className="row">
                        <span className="input-group-btn">
                          <button
                            type="button"
                            onClick={this.removeTopic(topics.length - 1)}
                            className="btn red darken-4 fa fa-minus s12"
                          />
                        </span>
                        <span className="input-group-btn">
                          <button
                            type="button"
                            onClick={this.addTopic}
                            className="btn green darken-4 fa fa-plus s12"
                          />
                        </span>
                        <span className="input-group-btn">
                          <button
                            className="btn fa fa-floppy-o pull-right s12"
                            role="submit"
                          >
                            {' '}
                            Save{' '}
                          </button>
                        </span>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </Fragment>
        )}
      </ThemeContext.Consumer>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('topics');
  return { units: _Units.find({}).fetch() };
})(Unit);

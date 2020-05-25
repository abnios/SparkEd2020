import React from 'react';
import PropTypes from 'prop-types';

const ExternalLinksView = ({ externallinks }) => {
  if (!externallinks || !externallinks.length) {
    return <li className={'collection-item'}> No External links!</li>;
  }
  return externallinks.map(externallink => (
    <li className="collection-item" key={externallink._id} >
      <span>{externallink.name}<br />
      <a
        href={externallink.url}
        target="_blank"
        rel="noopener noreferrer"
        // className="secondary-content"
         
         style={{ fontSize:11, color:'blue' }}
      >
        {externallink.url}
      </a>
      </span>
    </li>
  ));
};

ExternalLinksView.propTypes = {
  externallinks: PropTypes.array,
};

export default ExternalLinksView;

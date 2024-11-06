import DoughnutCard from '@/components/Charts/DoughnutCard';
import Metrics from '@/components/Charts/MetricChart';
import VerticalCard from '@/components/Charts/VerticalCard';
import { CardType } from '@/constants';

import React from 'react';

const RenderWidgets = (card, handleDeleteUser) => {
  if (card.form_field_names[0].cart_type === CardType.METRIC) {
    return (
      <Metrics
        key={card.id}
        title={card.card_name}
        fieldName={card.form_field_names[0].field_name.value}
        deleteCard={() => handleDeleteUser(card.id)}
      />
    );
  } else if (card.form_field_names[0].cart_type === CardType.VERTICAL) {
    return (
      <div key={card.id} className="h-full md:col-span-2">
        <VerticalCard
          card={card}
          deleteCard={() => handleDeleteUser(card.id)}
        />
      </div>
    );
  } else if (card.form_field_names[0].cart_type === CardType.DAUGHNUT) {
    return (
      <div key={card.id} className="h-full md:col-span-2 md:row-span-2">
        <DoughnutCard
          card={card}
          deleteCard={() => handleDeleteUser(card.id)}
        />
      </div>
    );
  }
};

export default RenderWidgets;

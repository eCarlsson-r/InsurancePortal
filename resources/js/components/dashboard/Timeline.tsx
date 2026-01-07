import React from "react";
import timelineData from "../../data/timeline-data";

interface TimelineItemData {
    date: string;
    text: string;
    link?: {
        url: string;
        text: string;
    };
}

const TimelineItem = ({ data }: { data: TimelineItemData }) => (
  <div className="timeline-item">
    <div className="timeline-item-content">
      <time>{data.date}</time>
      <p>{data.text}</p>
      {data.link && (
        <a href={data.link.url} target="_blank" rel="noopener noreferrer">
          {data.link.text}
        </a>
      )}
      <span className="circle" />
    </div>
  </div>
);

const Timeline = () =>
    timelineData.length > 0 && (
        <div className="timeline-container">
            {timelineData.map((data, idx) => (
                <TimelineItem data={data} key={idx} />
            ))}
        </div>
    );

export default Timeline;

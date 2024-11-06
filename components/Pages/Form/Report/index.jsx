import Card from '@/components/Card';
import moment from 'moment';
import Image from 'next/image';
import FormLocation from '../Location';
import {
  CHECKBOX_OPTIONS,
  DATE_FIELD,
  LOCATION,
  MULTIPLE_PHOTO_FIELD,
  SIGNATURE,
  SINGLE_PHOTO_FIELD,
  SWITCH,
  VIDEO_FIELD,
} from '@/constants/fieldType';

const Report = ({ answers }) => {
  const FORM = answers?.[0]?.form.form_details_json;

  const groupedAnswersBySection = answers.reduce((result, obj) => {
    const sectionId = obj.field_details?.section;

    // Check if the ID already exists in the result array
    const existingGroup = result.find((group) => group.sectionId === sectionId);

    if (existingGroup) {
      // If the ID exists, add the object to the existing group
      existingGroup.answer.push(obj);
    } else {
      // If the ID doesn't exist, create a new group and add it to the result array
      result.push({ sectionId, answer: [obj] });
    }
    return result;
  }, []);

  return (
    <Card>
      <div className="w-full">
        {/* Page header */}
        <div className="p-5 border-b">
          {/* Title */}
          <h1 className="text-base font-semibold md:text-lg text-[#1E293B]">
            Report
          </h1>
        </div>

        {/* Content */}
        <div className="w-full">
          {groupedAnswersBySection.length > 0 ? (
            groupedAnswersBySection?.map((answers, i) => (
              <div key={i} className="flex flex-col md:flex-row md:-mr-px">
                <div className="w-full">
                  <p className="px-5 py-3 text-sm font-bold leading-snug bg-gray-100 text-[#64748B]">
                    {
                      FORM.sections.find((x) => x.id === answers.sectionId)
                        ?.name
                    }
                  </p>
                  <section className="px-5">
                    <ul>
                      {answers.answer.map((answer, i) => (
                        <RenderAnswers
                          key={i}
                          question={answer.field_details.label}
                          answer={answer.field_value}
                          type={answer.field_details.fieldType}
                        />
                      ))}
                    </ul>
                  </section>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col md:flex-row md:-mr-px">
              <div className="w-full">
                <p className="px-5 py-3 text-sm font-bold leading-snug bg-gray-100 text-[#64748B]"></p>
                <section className="px-5">
                  <ul>
                    {answers.map((answer) => (
                      <RenderAnswers
                        question={answer.field_details.label}
                        answer={answer.field_value}
                        type={answer.field_details.fieldType}
                      />
                    ))}
                  </ul>
                </section>
              </div>
            </div>
          )}

          {/* <div className="flex flex-col md:flex-row md:-mr-px">
            <div className="w-full">
              <p className="px-5 py-3 text-sm font-bold leading-snug bg-gray-100 text-[#64748B]">
                Baustellenstagesbericht
              </p>
              <section className="px-5">
                <ul>
                  <li className="flex items-center justify-between py-3 border-b border-slate-200">
                    <div className="text-sm text-[#475569]">Date / Time</div>
                    <div className="text-sm text-[#475569]">
                      30/11/2022 19:12
                    </div>
                  </li>
                  <li className="flex items-center justify-between py-3 border-b border-slate-200">
                    <div className="text-sm text-[#475569]">
                      Bauleiter Subunternehmer
                    </div>
                    <div className="text-sm text-[#475569]">Jan pieters</div>
                  </li>
                  <li className="flex items-center justify-between py-3 border-b border-slate-200">
                    <div className="text-sm text-[#475569]">NVT Auswahlen</div>
                    <div className="text-sm text-[#475569]">1V089</div>
                  </li>
                  <li className="flex flex-col items-start justify-between gap-5 py-3 border-b md:flex-row border-slate-200">
                    <div className="text-sm text-[#475569]">
                      Startpunkt Standort / GPS
                    </div>
                    <div className="text-sm text-[#475569]">
                      <div>
                        <iframe
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d155959.4947249287!2d4.778306497694546!3d52.35469553627632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c63fb5949a7755%3A0x6600fd4cb7c0af8d!2sAmsterdam%2C%20Netherlands!5e0!3m2!1sen!2slk!4v1679639421647!5m2!1sen!2slk"
                          width="250"
                          height="150"
                          allowfullscreen=""
                          loading="lazy"
                          referrerpolicy="no-referrer-when-downgrade"
                        ></iframe>
                      </div>
                    </div>
                  </li>
                  <li className="flex items-center justify-between py-3 border-b border-slate-200">
                    <div className="text-sm text-[#475569]">NVT Auswahlen</div>
                    <div className="text-sm text-indigo-500">
                      <Link href="#">Download document {'->'} </Link>
                    </div>
                  </li>
                </ul>
              </section>
            </div>
          </div> */}
          {/* <div className="flex flex-col md:flex-row md:-mr-px">
            <div className="w-full">
              <p className="px-5 py-3  text-sm font-bold leading-snug bg-gray-100 text-[#64748B]">
                Dokumentation bevor Baubeginn
              </p>
              <section className="px-5">
                <ul>
                  <li className="flex items-center justify-between py-3 border-b border-slate-200">
                    <div className="text-sm text-[#475569]">Date / Time</div>
                    <div className="text-sm text-[#475569]">
                      30/11/2022 19:12
                    </div>
                  </li>
                  <li className="flex items-center justify-between py-3 border-b border-slate-200">
                    <div className="text-sm text-[#475569]">
                      Bauleiter Subunternehmer
                    </div>
                    <div className="text-sm text-[#475569]">Jan pieters</div>
                  </li>
                  <li className="flex items-center justify-between py-3 border-b border-slate-200">
                    <div className="text-sm text-[#475569]">NVT Auswahlen</div>
                    <div className="text-sm text-[#475569]">1V089</div>
                  </li>
                  <li className="flex flex-col items-start justify-between gap-5 py-3 border-b md:flex-row border-slate-200">
                    <div className="text-sm text-[#475569]">
                      Startpunkt Standort / GPS
                    </div>
                    <div className="text-sm text-[#475569]">
                      <Image
                        src="/images/applications-image-26.jpg"
                        alt="image"
                        width={250}
                        height={150}
                      />
                      <p className="mt-1 text-right text-[#475569]">
                        30/11/2022 19:12
                      </p>
                    </div>
                  </li>
                  <li className="flex items-center justify-between py-3 border-b border-slate-200">
                    <div className="text-sm text-[#475569]">NVT Auswahlen</div>
                    <div className="text-sm text-indigo-500">
                      <Link href="#">Download video {'->'} </Link>
                    </div>
                  </li>
                </ul>
              </section>
            </div>
          </div> */}
        </div>
      </div>
    </Card>
  );
};

export default Report;

const RenderAnswers = ({ question, answer, type }) => {
  return type === MULTIPLE_PHOTO_FIELD ? (
    <></>
  ) : (
    <li className="flex items-start justify-between py-3 border-b border-slate-200">
      <div className="text-sm text-[#475569] basis-2/6">{question}</div>
      <div className="text-sm text-[#475569] text-right">
        {type === DATE_FIELD
          ? moment(answer).format('DD/MM/YYYY HH:MM')
          : type === SWITCH
          ? SwitchValue(answer)
          : type === SIGNATURE
          ? RenderImage(answer)
          : type === CHECKBOX_OPTIONS
          ? CheckBoxValue(answer)
          : type === LOCATION
          ? FormLocation(answer)
          : type === SINGLE_PHOTO_FIELD
          ? RenderImage(answer)
          : type === VIDEO_FIELD
          ? RenderVideo(answer)
          : answer}
      </div>
    </li>
  );
};

const SwitchValue = (val) => {
  if (val === 0) {
    return 'True';
  } else {
    return 'False';
  }
};

const RenderImage = (val) => {
  return <Image src={val} width={250} height={150} className="p-1 border" />;
};

const RenderVideo = (val) => {
  return (
    <>
      <div className="text-sm text-[#475569]">NVT Auswahlen</div>
      <div className="text-sm text-indigo-500">
        {/* <Link href={val} download>
          Download video {'->'}
        </Link> */}
        <a href={val} download>
          Download video
        </a>
      </div>
    </>
    // <video width={250} height={150} controls className="p-1 border">
    //   <source src={val} type="video/mp4" />
    // </video>
  );
};

const CheckBoxValue = (val) => {
  const value = JSON.parse(val);

  if (value.length > 0) {
    return (
      <ul>
        {value.map((v) => (
          <li key={v}>{v}</li>
        ))}
      </ul>
    );
  } else {
    return '';
  }
};

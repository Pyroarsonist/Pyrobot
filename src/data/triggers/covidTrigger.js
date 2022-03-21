import { readFile } from 'node:fs/promises';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import moment from 'moment';

const getPdf = async (dateString) => {
  const assetsPath = './assets';
  const path = `${assetsPath}/covid.pdf`;
  const file = await readFile(path);

  const pdfDoc = await PDFDocument.load(file);

  pdfDoc.registerFontkit(fontkit);
  const fontFile = await readFile(`${assetsPath}/NotoSans-Regular.ttf`);

  const customFont = await pdfDoc.embedFont(fontFile);

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  const headerDatesData = {
    x: 151,
    y: 746,
    fontSize: 8.75,
  };

  const time = '15:00';

  const date = `${dateString} ${time}`;

  const drawRect = (offsetX = 0) => {
    firstPage.drawRectangle({
      x: headerDatesData.x - 5 + offsetX,
      y: headerDatesData.y - 5,
      width: 75,
      height: 15,
      // #FEFAEF
      color: rgb(0xfe / 255, 0xfa / 255, 0xef / 255),
    });
  };

  const drawText = (offsetX = 0) => {
    firstPage.drawText(date, {
      x: headerDatesData.x + offsetX,
      y: headerDatesData.y,
      size: headerDatesData.fontSize,
      font: customFont,
    });
  };

  // header line
  drawRect();
  drawText();

  const offset = 173;
  drawRect(offset);
  drawText(offset);

  const footerDatesData = {
    x: 534,
    y: 35,
    fontSize: 7.15,
  };

  firstPage.drawRectangle({
    x: footerDatesData.x - 2,
    y: footerDatesData.y - 2,
    width: 75,
    height: 15,
    // #FEFAEF
    color: rgb(0xfe / 255, 0xfa / 255, 0xef / 255),
  });

  firstPage.drawText(dateString, {
    x: footerDatesData.x,
    y: footerDatesData.y,
    size: footerDatesData.fontSize,
    font: customFont,
  });

  const pdfBytes = await pdfDoc.save();

  return Buffer.from(pdfBytes);
};

const regex = /(covid|ковид)(?<date>.*)/gi;

// eslint-disable-next-line import/prefer-default-export
export const covidTrigger = async (ctx) => {
  if (!ctx.pyroInfo.isAdmin) {
    return false;
  }

  const response = !!ctx.message.text.match(regex);
  if (!response) {
    return false;
  }

  try {
    const { date } = regex.exec(ctx.message.text).groups;
    const momentDate = moment(date, 'DD.MM.YYYY');
    const finalDate = momentDate.isValid() ? momentDate : moment();

    const file = await getPdf(finalDate.format('DD.MM.YYYY'));
    await ctx.replyWithDocument(
      { source: file, filename: 'COVID.pdf' },
      ctx.pyroInfo.replyOptions,
    );
  } catch (e) {
    console.error(e);
    await ctx.reply('кританул(', ctx.pyroInfo.replyOptions);
  }

  return true;
};

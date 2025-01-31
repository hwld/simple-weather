import {
  test,
  expect,
  NextFixture,
} from "next/experimental/testmode/playwright";
import { mockCurrentWeather, mockForecast, mockLocation } from "./mocks";
import { Routes } from "@/routes";
import { WeatherApiErrorResopnse, ForecastResponse } from "@/api/schema";
import { ForecastApiUrl } from "@/api/url";

const createFetchHandler: (
  response: Response
) => Parameters<NextFixture["onFetch"]>[0] = (response) => {
  return (req) => {
    const url = new URL(req.url);
    url.search = "";
    if (url.toString() === ForecastApiUrl) {
      return response;
    }
    return "abort";
  };
};

test.describe("現在の天気ページ", () => {
  test("未検索時には「検索してください」というテキストが存在する", async ({
    next,
    page,
  }) => {
    next.onFetch(() => "abort");

    await page.goto(Routes.home({ locationId: "" }));

    expect(
      await page.getByText("検索してください", { exact: false }).count()
    ).toBeGreaterThan(0);
  });

  test("検索した地域の天気情報が取得できた場合は地域名が存在する", async ({
    next,
    page,
  }) => {
    next.onFetch(
      createFetchHandler(
        new Response(
          JSON.stringify({
            location: mockLocation,
            current: mockCurrentWeather,
            forecast: mockForecast,
          } satisfies ForecastResponse)
        )
      )
    );

    await page.goto(Routes.home({ locationId: "dummy" }));

    expect(
      await page.getByText(mockLocation.name, { exact: false }).count()
    ).toBeGreaterThan(0);
  });

  test("検索した地域が見つからなかった場合には「見つかりませんでした」というテキストが存在する", async ({
    next,
    page,
  }) => {
    next.onFetch(
      createFetchHandler(
        new Response(
          JSON.stringify({
            error: { code: 1006 },
          } satisfies WeatherApiErrorResopnse),
          { status: 400 }
        )
      )
    );

    await page.goto(Routes.home({ locationId: "dummy" }));

    expect(
      await page.getByText("見つかりませんでした", { exact: false }).count()
    ).toBeGreaterThan(0);
  });

  test("APIでエラーが発生している場合は「エラーが発生しました」というテキストが存在する", async ({
    next,
    page,
  }) => {
    next.onFetch(createFetchHandler(new Response(null, { status: 500 })));

    await page.goto(Routes.home({ locationId: "dummy" }));

    expect(
      await page.getByText("エラーが発生しました", { exact: false }).count()
    ).toBeGreaterThan(0);
  });
});

test.describe("指定日の天気ページ", () => {
  test("指定した地域と日時の天気予報が取得できた場合は地域名がと日時が存在する", async ({
    next,
    page,
  }) => {
    next.onFetch(
      createFetchHandler(
        new Response(
          JSON.stringify({
            location: mockLocation,
            current: mockCurrentWeather,
            forecast: mockForecast,
          } satisfies ForecastResponse)
        )
      )
    );

    await page.goto(Routes.detail({ locationId: "dummy", date: "1970-01-01" }));

    expect(
      await page.getByText(mockLocation.name, { exact: false }).count()
    ).toBeGreaterThan(0);
  });

  test("指定した地域が見つからなかった場合には「見つかりませんでした」というテキストが存在する", async ({
    next,
    page,
  }) => {
    next.onFetch(
      createFetchHandler(
        new Response(
          JSON.stringify({
            error: { code: 1006 },
          } satisfies WeatherApiErrorResopnse),
          { status: 400 }
        )
      )
    );

    await page.goto(Routes.detail({ locationId: "dummy", date: "1970-01-01" }));

    expect(
      await page.getByText("見つかりませんでした", { exact: false }).count()
    ).toBeGreaterThan(0);
  });

  test("日時が正しく指定されていなければ「エラーが発生しました」というテキストが存在する", async ({
    next,
    page,
  }) => {
    next.onFetch(() => "abort");

    await page.goto(Routes.detail({ locationId: "dummy", date: "wrong" }));

    expect(
      await page.getByText("エラーが発生しました", { exact: false }).count()
    ).toBeGreaterThan(0);
  });

  test("APIでエラーが発生している場合は「エラーが発生しました」というテキストが存在する", async ({
    next,
    page,
  }) => {
    next.onFetch(createFetchHandler(new Response(null, { status: 500 })));

    await page.goto(Routes.detail({ locationId: "dummy", date: "1970-01-01" }));

    expect(
      await page.getByText("エラーが発生しました", { exact: false }).count()
    ).toBeGreaterThan(0);
  });
});

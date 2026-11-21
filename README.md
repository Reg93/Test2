# Internet Speed Test

A small command-line utility that measures download performance by making **10 sequential HTTP GET requests** to a URL.

The project uses only built-in Node.js APIs. No third-party dependencies are required.

Небольшая утилита командной строки, которая измеряет производительность загрузки, выполняя 10 последовательных HTTP GET-запросов к указанному URL-адресу.

Проект использует только встроенные API Node.js. Сторонние зависимости не требуются.

## Requirements

- Node.js 20 or newer
- Internet connection
- A URL that returns downloadable content (for example, a large image or file)

## Требования
- Node.js 20 или новее
- Подключение к интернету
- URL-адрес, который возвращает загружаемый контент (например, большое изображение или файл)

## Run

```bash
npm start -- https://example.com/path/to/large-image.jpg
```

You can also run it directly:

```bash
node src/cli.js https://example.com/path/to/large-image.jpg
```

Show usage:

```bash
npm start
```

## What it measures

For each request, the script:

1. Sends an HTTP GET request.
2. Follows HTTP redirects.
3. Reads the response body completely as a stream.
4. Counts the actual number of downloaded bytes.
5. Measures the time from starting the request until the response body has been fully read.

After all 10 requests, it prints:

- total downloaded data;
- average request duration;
- total benchmark duration;
- average amount of data per request;
- average download speed in **MB/s** and **Mbps**.

## Что измеряется

Для каждого запроса скрипт:

- Отправляет HTTP GET-запрос.
- Следует за HTTP-редиректами.
- Полностью считывает тело ответа в виде потока.
- Подсчитывает фактическое количество загруженных байтов.
- Измеряет время от начала запроса до полного считывания тела ответа.

## После выполнения всех 10 запросов выводится:

- общий объем загруженных данных;
- средняя продолжительность запроса;
- общая продолжительность тестирования;
- средний объем данных на один запрос;
- средняя скорость загрузки в МБ/с и Мбит/с.

### Speed calculation

```text
Average download speed (bytes/s) =
    total downloaded bytes / total benchmark duration in seconds

MB/s = bytes per second / 1,000,000
Mbps = bytes per second * 8 / 1,000,000

Средняя скорость загрузки (байт/с) =
    общее количество загруженных байтов / общая продолжительность тестирования в секундах

МБ/с = байт в секунду / 1 000 000
Мбит/с = байт в секунду * 8 / 1 000 000
```

The benchmark duration covers the complete sequence of requests. Since requests are sequential, the script does not intentionally overlap downloads.

Продолжительность тестирования охватывает всю последовательность запросов. Поскольку запросы выполняются последовательно, скрипт намеренно не перекрывает загрузки.

## Error handling

- Only `http://` and `https://` URLs are accepted.
- Invalid URLs produce a readable error.
- Non-success HTTP responses (status outside `200–299`) are reported as errors.
- Each request has a 60-second timeout.
- If a request fails, the benchmark stops and exits with a non-zero status code.

## Обработка ошибок

- Принимаются только URL-адреса с протоколами http:// и https://.
- Неверные URL-адреса вызывают понятное сообщение об ошибке.
- HTTP-ответы с кодами, не указывающими на успех (статус вне диапазона 200–299), сообщаются как ошибки.
- Для каждого запроса установлен тайм-аут 60 секунд.
- Если запрос завершается с ошибкой, тестирование останавливается и завершается с ненулевым кодом состояния (exit code).

## Tests

Run the unit tests for the output-formatting helpers:

Запуск модульных тестов для вспомогательных функций форматирования вывода:

```bash
npm test
```

## Project structure

```text
internet-speed-test/
├── src/
│   ├── benchmark.js    # HTTP download and benchmark calculations
│   ├── cli.js          # Command-line interface and output
│   └── format.js       # Formatting bytes, time and speed
├── test/
│   └── format.test.js  # Unit tests
├── index.js
├── package.json
├── README.md
└── .gitignore
```

## Notes about measurement

The result is an estimate of the download speed between the machine running this script and the selected server. It is not a universal measurement of the internet connection: the remote server, its location, response caching, network route, VPN, and other traffic can affect the result.

For a more representative test, use a sufficiently large file hosted on a reliable server. A tiny image may finish downloading so quickly that connection setup and latency have a noticeable effect on the result.

## Примечания к измерениям

Результат является оценкой скорости загрузки между машиной, запускающей этот скрипт, и выбранным сервером. Это не универсальное измерение качества интернет-соединения: на результат могут влиять удаленный сервер, его местоположение, кэширование ответов, сетевой маршрут, использование VPN и другой сетевой трафик.

Для более репрезентативного теста используйте достаточно большой файл, размещенный на надежном сервере. Крошечное изображение может загрузиться так быстро, что установка соединения и сетевая задержка (latency) окажут заметное влияние на результат.

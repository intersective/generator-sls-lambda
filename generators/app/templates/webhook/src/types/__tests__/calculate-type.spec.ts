import { calculateType } from "../calculate-type";

const messages = [
  {type: 'Default', payload: {
    verb: {
      id: 'https://adlnet.gov/xapi/verbs/general',
      display: {
        'en-US': 'done',
      },
    },
    actor: {
      id: 123,
      role: 'system',
      email: 'a+sysadmin@practera.com',
      uuid: 'c1cb6c9b-0a0a-c80b-b005-ba7f6c95fe6a',
    },
    object: {},
    context: {
    }
  }},
];

it('1. get the correct message', () => {
  messages.forEach(function(message) {
    const type = calculateType(message.type, message.payload, {});
    expect(type.constructor.name).toEqual(message.type);
  });
});


it('should throw an error', () => {
  expect(() => {
    calculateType('not handled', messages[0].payload, {})
  }).toThrow('Error getting the type');
});

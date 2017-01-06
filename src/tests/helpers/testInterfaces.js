import interfaceTestsMap from 'egxo/tests/interfaceTestsMap';

const testInterfaces = (aClass, createObject) => {
  aClass.getInterfaces().forEach((interfaceSymbol) => {
    interfaceTestsMap[interfaceSymbol](createObject);
  });
};

export default testInterfaces;
